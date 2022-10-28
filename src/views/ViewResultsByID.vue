<template>
  <h2 class="u-margin-bottom-small">Results</h2>
  <button class="button button--large button--primary" @click="$router.push({ name: 'resultsList' })">
    <BaseIcon name="arrow-left"></BaseIcon> Results List
  </button>

  <div class="results">
    <div class="widget results__details">
      <h3 class="u-margin-bottom-small">Details</h3>
      <ul>
        <li v-for="field in resultDataMap" :key="field[1]">
          <b>{{ field[0] }}:</b> {{ field[1] }}
        </li>
      </ul>
      <p class="u-margin-top-small" v-if="result.status === 'pending'">
        Further content will be shown upon successful job completion...
      </p>
    </div>

    <div class="widget results__notes">
      <h3 class="u-margin-bottom-small">Notes</h3>
      <p>{{ result.notes }}</p>
    </div>

    <div v-if="result.status === 'success'" class="widget results__downloads">
      <h3 class="u-margin-bottom-small">Downloads</h3>
      <div class="results__download-buttons-container">
        <button v-for="(file, index) in fileList" :key="index" @click="onClick(file, id)" class="button button--primary"
          type="button">
          {{ file }}&nbsp;<span>
            <BaseIcon name="download" />
          </span>
        </button>
      </div>
    </div>

    <template v-if="result.status === 'success'">
      <div class="widget results__genes-signatures">
        <ContentLoader v-if="!genesSignatures" viewBox="0 0 520 700" :animate="!genesSignatures">
          <rect x="20" y="5" rx="0" ry="0" width="1" height="700" />
          <rect x="20" y="699" rx="0" ry="0" width="520" height="2" />
          <rect x="40" y="75" rx="0" ry="0" width="80" height="630" />
          <rect x="140" y="125" rx="0" ry="0" width="80" height="580" />
          <rect x="240" y="105" rx="0" ry="0" width="80" height="610" />
          <rect x="340" y="35" rx="0" ry="0" width="80" height="670" />
          <rect x="440" y="55" rx="0" ry="0" width="80" height="650" />
        </ContentLoader>
        <GenesSignaturesMultichart v-else-if="typeof genesSignatures === 'object'" :data="genesSignatures">
        </GenesSignaturesMultichart>
        <svg v-else viewBox="0 0 520 700">
          <g stroke="var(--color-grey-lighter)" fill="var(--color-grey-lighter)">
            <rect x="20" y="5" rx="0" ry="0" width="1" height="700" />
            <rect x="20" y="699" rx="0" ry="0" width="520" height="2" />
            <rect x="40" y="75" rx="0" ry="0" width="80" height="630" />
            <rect x="140" y="125" rx="0" ry="0" width="80" height="580" />
            <rect x="240" y="105" rx="0" ry="0" width="80" height="610" />
            <rect x="340" y="35" rx="0" ry="0" width="80" height="670" />
            <rect x="440" y="55" rx="0" ry="0" width="80" height="650" />
          </g>
        </svg>
      </div>

      <BaseAccordion class="widget widget--color1 results__thumbnails">
        <template v-slot:title>Normalised Counts and Depletion Fold-Changes Charts</template>
        <template v-slot:content>
          <div class="thumbnails__content">
            <BaseThumbnail v-for="item in imageListByCathegory.normImages" :key="item.filename"
              @clicked="openModal(item, id)" :img="item"></BaseThumbnail>
          </div>
        </template>
      </BaseAccordion>

      <BaseAccordion class="widget widget--color2 results__thumbnails" height="42rem">
        <template v-slot:title>Chromosome Charts</template>
        <template v-slot:content>
          <div class="thumbnails__content">
            <BaseThumbnail v-for="item in imageListByCathegory.chrImages" :key="item.filename"
              @clicked="openModal(item, id)" :img="item"></BaseThumbnail>
          </div>
        </template>
      </BaseAccordion>

      <BaseAccordion class="widget widget--color3 results__thumbnails">
        <template v-slot:title>QC Assessment Charts</template>
        <template v-slot:content>
          <div class="thumbnails__content">
            <BaseThumbnail v-for="item in imageListByCathegory.qcImages" :key="item.filename"
              @clicked="openModal(item, id)" :img="item"></BaseThumbnail>
          </div>
        </template>
      </BaseAccordion>
    </template>
  </div>

  <BaseModal v-if="modalState != 'closed'" @modal-close="closeModal" :width="image.width">
    <template v-slot:header>{{ image.label }} </template>
    <template v-slot:body>
      <component v-if="modalState === 'opened'" :is="image.component" :data="data" />
      <div v-else-if="modalState === 'loading'">Loading...</div>
    </template>
  </BaseModal>
</template>

<script>
import fileServerAPI from "@/api/fileServer.js";
import fileList from "@/files.json";

import BoxPlotMultichart from "@/components/ccr/charts/boxplot/BoxPlotMultichart.vue";
import ChromosomeMultichart from "@/components/ccr/charts/chromosome/ChromosomeMultichart.vue";
import LineChartROC from "@/components/ccr/charts/linechart/LineChartROC.vue";
import LineChartPrRc from "@/components/ccr/charts/linechart/LineChartPrRc.vue";
import GenesSignaturesMultichart from "@/components/ccr/charts/genes_signatures/GenesSignaturesMultichart.vue";

import { ref, reactive, computed } from "vue";

import { date, download } from "@/composables/utilities.js";

import { ContentLoader } from "vue-content-loader";

import imageList from "@/images.json";

import { useStore } from "vuex";

export default {
  name: "ViewResultsByID",
  components: {
    BoxPlotMultichart,
    ChromosomeMultichart,
    LineChartROC,
    LineChartPrRc,
    GenesSignaturesMultichart,
    ContentLoader,
  },
  props: {
    id: {
      type: String,
    },
    result: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const image = ref({});
    const data = ref({});
    const modalState = ref("closed");

    const store = useStore();

    const user = computed(() => store.state.user.user);

    const imageListByCathegory = reactive({
      normImages: [],
      chrImages: [],
      qcImages: [],
    });
    const genesSignatures = ref(null);

    if (props.result.status === "success") {
      const objectKey = `/${user.value.username}/${props.id}/genes_signatures.json`;
      fileServerAPI
        .downloadFile({ objectKey })
        .then((response) => {
          genesSignatures.value = response.data;
        })
        .catch((err) => {
          const message = err?.message;
          store.dispatch("notification/sendErrorNotification", {
            title: "Unable to donwload genes signatures data",
            message,
          });
          genesSignatures.value = "error";
        });

      const imageListWithURL = imageList.map(async (image) => {
        try {
          const objectKey = `/${user.value.username}/${props.id}/${image.imgUri}`;
          const response = await fileServerAPI.downloadFile({ objectKey, blob: true });
          return { ...image, src: URL.createObjectURL(response.data) };
        } catch (error) {
          return {
            ...image,
            src: require("@/assets/img/placeholder-image.png"),
          };
        }
      });

      Promise.all(imageListWithURL).then((images) => {
        imageListByCathegory.normImages = images.filter(
          (image) => image.section === "norm"
        );
        imageListByCathegory.chrImages = images
          .filter((image) => image.section === "chr")
          .sort((image1, image2) => {
            const a = parseInt(image1.filename.match(/(\d+)/)[0]);
            const b = parseInt(image2.filename.match(/(\d+)/)[0]);
            return a - b;
          });
        imageListByCathegory.qcImages = images.filter(
          (image) => image.section === "qc"
        );
      });
    }

    const openModal = (img, id) => {
      modalState.value = "loading";
      const objectKey = `/${user.value.username}/${id}/${img.chart}.json`;
      fileServerAPI
        .downloadFile({ objectKey })
        .then((response) => {
          data.value = response.data;
          image.value = img;
          modalState.value = "opened";
        })
        .catch((err) => {
          const message = err?.message;
          store.dispatch("notification/sendErrorNotification", {
            title: `Unable to open chart ${img.chart}`,
            message,
          });
          closeModal();
        });
    };

    const closeModal = () => {
      image.value = {};
      data.value = {};
      modalState.value = "closed";
    };

    const onClick = (file, id) => {
      const objectKey = `/${user.value.username}/${id}/${file}`;
      fileServerAPI
        .downloadFile({ objectKey, blob: true })
        .then((response) => {
          download(response.data, file);
        })
        .catch((error) => {
          const message = error?.message;
          store.dispatch("notification/sendErrorNotification", {
            title: `Unable to download file ${file}`,
            message,
          });
        });
    };

    const labelFieldPairs = {
      id: "ID",
      title: "Title",
      email: "Email",
      label: "Data label",
      status: "Status",
      dateTime: "Date Time",
      nControls: "Number of controls",
      normMinReads: "Min number of reads in the control sample",
      method: "Normalization Method",
      libraryBuiltin: "Default Library",
      libraryFile: "Library File",
      fileCounts: "Counts File",
      filesFASTQcontrols: "FASTQ Controls",
      filesFASTQsamples: "FASTQ Samples",
      filesBAMcontrols: "BAM Controls",
      filesBAMsamples: "BAM Samples",
      errorMsg: "Error"
    };

    const resultDataMap = new Map();
    Object.entries(props.result).forEach(([key, field]) => {
      if (key !== "notes" && field && labelFieldPairs[key]) {
        let fieldValue = field;
        if (Array.isArray(field)) {
          fieldValue = field.join(", ");
        }
        resultDataMap.set(labelFieldPairs[key], fieldValue);
      }
    });

    return {
      fileList,
      openModal,
      closeModal,
      onClick,
      image,
      data,
      modalState,
      date,
      genesSignatures,
      imageListByCathegory,
      resultDataMap,
      user,
    };
  },
};
</script>

<style lang="scss">
.results {
  display: grid;
  grid-template-columns: minmax(min-content, 50rem) 50rem 1fr;
  grid-template-rows: repeat(8, min-content);
  grid-column-gap: 1.2em;
  grid-row-gap: 1.5em;
  margin-top: 1em;
  margin-bottom: 2em;
  grid-auto-flow: row dense;

  @media only screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }

  &__details {
    grid-column: 1 / 2;
    grid-row: 1 / 4;
  }

  &__notes {
    grid-column: 1 / 2;

    p {
      max-height: 30rem;
      overflow-y: scroll;
    }
  }

  &__genes-signatures {
    grid-column: 2 / 3;
    grid-row: 1 / 5;
    max-width: 60rem;
  }

  &__downloads {
    grid-column: 1 / 3;
  }

  &__download-buttons-container {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }

  &__thumbnails {
    grid-column: 1/ -1;
  }

  .thumbnails__content {
    display: grid;
    justify-items: left;
    gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(min-content, 32rem));
  }
}
</style>
