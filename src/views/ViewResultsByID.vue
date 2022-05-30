<template>
  <h2 class="u-margin-bottom-small">Results</h2>
  <div class="results">
    <div class="card results__details">
      <h3 class="u-margin-bottom-small">Details</h3>
      <ul>
        <li><b>Title: </b>{{ result.title }}</li>
        <li><b>Date: </b>{{ date(result.dateTime) }}</li>
        <li><b>Status: </b>{{ result.status }}</li>
        <li><b>Input counts file: </b>{{ result.fileCountsName }}</li>
        <li><b>Library: </b>{{ result.library }}</li>
        <li><b>Number of controls: </b>{{ result.nControls }}</li>
        <li>
          <b>Minimal number of reads in the control sample: </b>{{ result.normMinReads }}
        </li>
        <li><b>Normalization Method: </b>{{ result.method }}</li>
        <li v-if="result.notes"><b>Notes: </b>{{ result.notes }}</li>
      </ul>
    </div>
    <template v-if="result.status === 'success'">
      <div class="card results__genes-signatures">
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
      <div class="card results__downloads">
        <h3 class="u-margin-bottom-small">Downloads</h3>
        <div>
          <button v-for="(file, index) in fileList" :key="index" @click="onClick(file, id)"
            class="button button--primary button--small" type="button">
            {{ file }}&nbsp;<span>
              <BaseIcon name="download" />
            </span>
          </button>
        </div>
      </div>

      <BaseAccordion class="card card--color1 results__thumbnails">
        <template v-slot:title>Normalization</template>
        <template v-slot:content>
          <div class="thumbnails__content">
            <BaseThumbnail v-for="item in imageListByCathegory.normImages" :key="item.filename"
              @click="openModal(item, id)" :img="item"></BaseThumbnail>
          </div>
        </template>
      </BaseAccordion>

      <BaseAccordion class="card card--color2 results__thumbnails" height="42rem">
        <template v-slot:title>Chromosome Charts</template>
        <template v-slot:content>
          <div class="thumbnails__content">
            <BaseThumbnail v-for="item in imageListByCathegory.chrImages" :key="item.filename"
              @click="openModal(item, id)" :img="item"></BaseThumbnail>
          </div>
        </template>
      </BaseAccordion>

      <BaseAccordion class="card card--color3 results__thumbnails">
        <template v-slot:title>QC Assessment</template>
        <template v-slot:content>
          <div class="thumbnails__content">
            <BaseThumbnail v-for="item in imageListByCathegory.qcImages" :key="item.filename"
              @click="openModal(item, id)" :img="item"></BaseThumbnail>
          </div>
        </template>
      </BaseAccordion>
    </template>
    <p class="results__msg" v-else>
      Further content appears here upon successful job completion...
    </p>
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


const image = ref({});
const data = ref({});
const modalState = ref("closed");

const openModal = (img, id) => {
  modalState.value = "loading";
  CcrAPI.getChart({
    id,
    chart: img.chart,
  }).then((response) => {
    data.value = response.data;
    image.value = img;
    modalState.value = "opened";
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
      console.error("Something went wrong with downloading the file: " + err);
    });
};

export default {
  name: "ViewCRISPRcleanRResultShow",
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
    const imageListByCathegory = reactive({
      normImages: [],
      chrImages: [],
      qcImages: [],
    });
    const genesSignatures = ref(null);
    //const store = useStore();

    CcrAPI.getChart({ id: props.id, chart: "genes_signatures" }).then(
      (response) => {
        genesSignatures.value = response.data;
      }
    );

    const imageListWithURL = imageList.map(async (image) => {
      try {
        const response = await CcrAPI.getFile({
          id: props.id,
          fileUri: image.imgUri,
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
    };
  },
};
</script>

<style lang="scss">
.results {
  display: grid;
  grid-template-columns: minmax(min-content, 60rem) 60rem 1fr;
  grid-column-gap: 1.2em;
  grid-row-gap: 1.5em;
  margin-bottom: 2em;
  grid-auto-flow: row dense;

  @media only screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }

  &__msg {
    grid-column: 1 / 2;
  }

  &__details {
    grid-column: 1 / 2;

    @media only screen and (max-width: 1300px) {
      grid-column: 1 / -1;
    }
  }

  &__downloads {
    grid-column: 1 / 2;

    div {
      margin-bottom: 1em;
      display: flex;
      gap: 1em;
      flex-wrap: wrap;
    }
  }

  &__genes-signatures {
    grid-column: 2 / 3;

    @media only screen and (max-width: 800px) {
      max-width: 60rem;
    }
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
