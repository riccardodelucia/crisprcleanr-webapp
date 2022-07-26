<template>
  <h2 class="u-margin-bottom-small">Results</h2>
  <div class="results">
    <div class="widget results__details">
      <h3 class="u-margin-bottom-small">Details</h3>
      <ul class="results__list">
        <li v-for="field in resultDataMap" :key="field[1]">
          <b>{{ field[0] }}:</b> {{ field[1] }}
        </li>
      </ul>
      <div v-if="result.status === 'SUCCESS'" class="results__downloads">
        <button v-for="(file, index) in fileList" :key="index" @click="onClick(file, id)"
          class="button button--primary button--small" type="button">
          {{ file }}&nbsp;<span>
            <BaseIcon name="download" />
          </span>
        </button>
      </div>
      <p class="results__msg" v-else>
        Further content will be shown upon successful job completion...
      </p>
    </div>

    <template v-if="result.status === 'SUCCESS'">
      <div class="widget results__genes-signatures">
        <ContentLoader v-if="!genesSignatures" viewBox="0 0 520 700">
          <rect x="20" y="5" rx="0" ry="0" width="2" height="700" />
          <rect x="20" y="699" rx="0" ry="0" width="520" height="2" />
          <rect x="40" y="75" rx="0" ry="0" width="80" height="630" />
          <rect x="140" y="125" rx="0" ry="0" width="80" height="580" />
          <rect x="240" y="105" rx="0" ry="0" width="80" height="610" />
          <rect x="340" y="35" rx="0" ry="0" width="80" height="670" />
          <rect x="440" y="55" rx="0" ry="0" width="80" height="650" /> -->
        </ContentLoader>
        <GenesSignaturesMultichart v-else :data="genesSignatures">
        </GenesSignaturesMultichart>
      </div>


      <BaseAccordion class="widget widget--color1 results__thumbnails">
        <template v-slot:title>Normalization</template>
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
        <template v-slot:title>QC Assessment</template>
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

import CcrAPI from "@/api/ccr.js";
import fileList from "@/files.json";

import BoxPlotMultichart from "@/components/ccr/charts/boxplot/BoxPlotMultichart.vue";
import ChromosomeMultichart from "@/components/ccr/charts/chromosome/ChromosomeMultichart.vue";
import LineChartROC from "@/components/ccr/charts/linechart/LineChartROC.vue";
import LineChartPrRc from "@/components/ccr/charts/linechart/LineChartPrRc.vue";
import GenesSignaturesMultichart from "@/components/ccr/charts/genes_signatures/GenesSignaturesMultichart.vue";

import { ref, reactive } from "vue";

import { date, download } from "@/composables/utilities.js";

import { ContentLoader } from "vue-content-loader";

import imageList from "@/images.json";

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

    const imageListByCathegory = reactive({
      normImages: [],
      chrImages: [],
      qcImages: [],
    });
    const genesSignatures = ref(null);

    CcrAPI.getChart({ id: props.id, chart: "genes_signatures" }).then(
      (response) => {
        genesSignatures.value = response.data;
      }
    ).catch((err) => {
      console.error(`Something went wrong with downloading the file: ${err}`);
    });

    const imageListWithURL = imageList.map(async (image) => {
      try {
        const response = await CcrAPI.getFile({
          id: props.id,
          fileUri: image.imgUri,
        }).catch((err) => {
          console.error(`Something went wrong with downloading the file: ${err}`);
        });
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

    const openModal = (img, id) => {
      modalState.value = "loading";
      CcrAPI.getChart({
        id,
        chart: img.chart,
      }).then((response) => {
        data.value = response.data;
        image.value = img;
        modalState.value = "opened";
      }).catch((err) => {
        console.error(`Something went wrong with downloading the file: ${err}`);
      });
    };

    const closeModal = () => {
      image.value = {};
      data.value = {};
      modalState.value = "closed";
    };

    const onClick = (file, id) => {
      CcrAPI.getFile({ id, fileUri: file })
        .then((response) => {
          download(response.data, file);
        })
        .catch((err) => {
          console.error(`Something went wrong with downloading the file: ${err}`);
        });
    };

    const labelFieldPairs = {
      id: "ID",
      title: "Title",
      email: "Email",
      label: "Data label",
      notes: "Notes",
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
      filesBAMsamples: "BAM Samples"
    }

    const resultDataMap = new Map();
    Object.entries(props.result).forEach(([key, field]) => {
      if (field && labelFieldPairs[key]) {
        let fieldValue = field
        if (Array.isArray(field)) {
          fieldValue = field.join(", ")
        }
        resultDataMap.set(labelFieldPairs[key], fieldValue)
      }

    })

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
      resultDataMap
    };
  },
};
</script>

<style lang="scss">
.results {
  display: grid;
  grid-template-columns: minmax(min-content, 50rem) 50rem 1fr;
  grid-column-gap: 1.2em;
  grid-row-gap: 1.5em;
  margin-bottom: 2em;
  grid-auto-flow: row dense;

  @media only screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }

  &__msg {
    grid-column: 1 / 2;
  }

  &__details {
    //font-size: 1.5rem;
    grid-column: 1 / 2;
  }

  &__list {
    padding: 1em 0;
  }

  &__downloads {
    //grid-column: 1 / 2;
    padding: 1em 0;
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }

  &__genes-signatures {
    grid-column: 2 / 3;
    max-width: 60rem;
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
