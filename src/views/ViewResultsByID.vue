<template>
  <AppLayout>
    <div class="app-content ht-layout-stack">
      <h2>Results</h2>
      <router-link
        :to="{ name: 'resultsList' }"
        class="ht-button"
        data-type="secondary"
      >
        <div class="ht-flex-align-center">
          <vue-feather type="arrow-left"></vue-feather><span>Results List</span>
        </div>
      </router-link>
      <div v-if="result" class="results">
        <div class="ht-card ht-container details">
          <h2>Details</h2>
          <ul>
            <li><b>ID:</b> {{ result.id }}</li>
            <li><b>Title:</b> {{ result.title }}</li>
            <li><b>Email:</b> {{ result.email }}</li>
            <li><b>Data Label:</b> {{ result.label }}</li>
            <li><b>Status:</b> {{ result.status }}</li>
            <li><b>Date Time:</b> {{ date(result.dateTime) }}</li>
            <li><b>Number of Controls:</b> {{ result.nControls }}</li>
            <li>
              <b>Min number of reads in the control sample:</b>
              {{ result.normMinReads }}
            </li>
            <li><b>Normalization Method:</b> {{ result.method }}</li>
            <li v-if="result.libraryBuiltin">
              <b>Library Builtin:</b> {{ result.libraryBuiltin }}
            </li>
            <li v-if="result.libraryFile">
              <b>Library File:</b> {{ result.libraryFile }}
            </li>
            <li v-if="result.fileCounts">
              <b>Counts File:</b> {{ result.fileCounts }}
            </li>
            <li v-if="result.filesFASTQcontrols">
              <b>FASTQ Controls:</b> {{ result.filesFASTQcontrols }}
            </li>
            <li v-if="result.filesFASTQsamples">
              <b>FASTQ Samples:</b> {{ result.filesFASTQsamples }}
            </li>
            <li v-if="result.filesBAMcontrols">
              <b>BAM Controls:</b> {{ result.filesBAMcontrols }}
            </li>
            <li v-if="result.filesBAMsamples">
              <b>BAM Samples:</b> {{ result.filesBAMsamples }}
            </li>
            <li v-if="result.errorMsg"><b>Error:</b> {{ result.errorMsg }}</li>
          </ul>
          <p v-if="result.status === 'pending'">
            Further content will be shown upon successful job completion...
          </p>
        </div>

        <div class="ht-card ht-container notes">
          <h2>Notes</h2>
          <p>{{ result.notes }}</p>
        </div>

        <div
          v-if="result.status === 'success'"
          class="ht-card ht-container downloads"
        >
          <h2>Downloads</h2>
          <div class="buttons-container">
            <a
              v-for="(file, index) in fileList"
              :key="index"
              class="ht-button"
              type="button"
              @click="onClick(file, id)"
            >
              <div class="ht-flex-align-center">
                {{ file }}
                <vue-feather type="download" />
              </div>
            </a>
          </div>
        </div>

        <template v-if="result.status === 'success'">
          <div v-if="genesSignatures" class="ht-card ht-container chart">
            <GenesSignaturesMultichart :data="genesSignatures">
            </GenesSignaturesMultichart>
          </div>

          <div class="thumbnails-1">
            <ht-accordion class="ht-card ht-container color--1">
              <template #header>
                <span>
                  Normalised Counts and Depletion Fold-Changes Charts
                </span>
              </template>
              <template #panel>
                <div class="thumbnails__content ht-grid-auto">
                  <div
                    v-for="img in imageListByCathegory.normImages"
                    :key="img.filename"
                    class="thumbnail"
                    @click="openModal(img, id)"
                  >
                    <img
                      :src="img.src ? img.src : imagePlaceholder"
                      :alt="img.title"
                    />
                    <p>{{ img.label }}</p>
                  </div>
                </div>
              </template>
            </ht-accordion>
          </div>
          <div class="thumbnails-2">
            <ht-accordion class="ht-card ht-container color--2">
              <template #header>
                <span>Chromosome Charts</span>
              </template>
              <template #panel>
                <div class="thumbnails__content ht-grid-auto">
                  <div
                    v-for="img in imageListByCathegory.chrImages"
                    :key="img.filename"
                    class="thumbnail"
                    @click="openModal(img, id)"
                  >
                    <img :src="img.src" :alt="img.title" />
                    <p>{{ img.label }}</p>
                  </div>
                </div>
              </template>
            </ht-accordion>
          </div>
          <div class="thumbnails-3">
            <ht-accordion
              label="QC Assessment Charts"
              class="ht-card ht-container color--3"
            >
              <template #header>
                <span>QC Assessment Charts</span>
              </template>
              <template #panel>
                <div class="thumbnails__content ht-grid-auto">
                  <div
                    v-for="img in imageListByCathegory.qcImages"
                    :key="img.filename"
                    class="thumbnail"
                    @click="openModal(img, id)"
                  >
                    <img :src="img.src" :alt="img.title" />
                    <p>{{ img.label }}</p>
                  </div>
                </div>
              </template>
            </ht-accordion>
          </div>
        </template>
      </div>
      <p v-else>Loading...</p>

      <dialog id="modal" ref="modal" class="modal">
        <header>
          <h2>
            {{ image.label ? image.label : 'Loading...' }}
          </h2>
          <ht-button-icon
            type="button"
            label="Close Modal"
            icon-type="x"
            aria-controls="modal"
            @click="closeModal"
          >
          </ht-button-icon>
        </header>
        <component :is="image.component" v-if="data" :data="data" />
      </dialog>
    </div>
  </AppLayout>
</template>

<script>
import fileServerAPI from '@/api/fileServer.js';
import fileList from '@/files.json';

import BoxPlotMultichart from '@/components/BoxPlotMultichart.vue';
import ChromosomeMultichart from '@/components/ChromosomeMultichart.vue';
import LineChartROC from '@/components/LineChartROC.vue';
import LineChartPrRc from '@/components/LineChartPrRc.vue';
import GenesSignaturesMultichart from '@/components/GenesSignaturesMultichart.vue';

import AppLayout from '@/layouts/AppLayout.vue';

import { ref, reactive, onMounted, onErrorCaptured } from 'vue';

import { ContentLoader } from 'vue-content-loader';

import imagePlaceholder from '@/assets/img/placeholder-image.png';

import { download } from '../utils.js';

import { useAuth } from '@/authentication.js';
import nProgress from 'nprogress';

import CcrAPI from '@/api/ccr.js';

import imageList from '@/images.json';

import { date } from '../utils.js';

export default {
  name: 'ViewResultsByID',
  components: {
    AppLayout,
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
      default: '',
    },
  },
  setup(props) {
    const image = ref({});
    const data = ref({});
    const modal = ref(null);

    const auth = useAuth();
    const { userProfile } = auth;

    const username = userProfile.username;

    const imageListByCathegory = reactive({
      normImages: [],
      chrImages: [],
      qcImages: [],
    });

    const result = ref(null);
    const genesSignatures = ref(null);
    const images = ref(null);

    onMounted(() =>
      CcrAPI.getResultByID(props.id).then((response) => {
        const { data } = response;
        result.value = data;

        if (result.value.status === 'success') {
          const objectKey = `/${username}/${props.id}/genes_signatures.json`;
          return fileServerAPI
            .downloadFile({ objectKey })
            .then((response) => {
              const { data } = response;
              genesSignatures.value = data;
              const imageListWithURL = imageList.map(async (image) => {
                try {
                  const objectKey = `/${username}/${props.id}/${image.imgUri}`;
                  const response = await fileServerAPI.downloadFile({
                    objectKey,
                    blob: true,
                  });
                  return {
                    ...image,
                    src: URL.createObjectURL(response.data),
                  };
                } catch {
                  return {
                    ...image,
                    src: null,
                  };
                }
              });
              return Promise.all(imageListWithURL);
            })
            .then((resolvedPromiseArray) => {
              images.value = resolvedPromiseArray;
              imageListByCathegory.normImages = images.value.filter(
                (image) => image.section === 'norm',
              );
              imageListByCathegory.chrImages = images.value
                .filter((image) => image.section === 'chr')
                .sort((image1, image2) => {
                  const a = parseInt(image1.filename.match(/(\d+)/)[0]);
                  const b = parseInt(image2.filename.match(/(\d+)/)[0]);
                  return a - b;
                });
              imageListByCathegory.qcImages = images.value.filter(
                (image) => image.section === 'qc',
              );
            });
        }
      }),
    );

    const openModal = (img, id) => {
      const body = document.querySelector('body');
      body.classList.add('ht-prevent-scroll');
      modal.value.showModal();
      image.value = {};
      data.value = {};

      const objectKey = `/${username}/${id}/${img.chart}.json`;
      return fileServerAPI.downloadFile({ objectKey }).then((response) => {
        data.value = response.data;
        image.value = img;
      });
    };

    const closeModal = () => {
      const body = document.querySelector('body');
      body.classList.remove('ht-prevent-scroll');
      modal.value.close();
      image.value = {};
      data.value = {};
    };

    const onClick = (file, id) => {
      nProgress.start();
      const objectKey = `/${username}/${id}/${file}`;
      return fileServerAPI
        .downloadFile({ objectKey, blob: true })
        .then((response) => {
          download(response.data, file);
          nProgress.done();
        });
    };

    onErrorCaptured(() => {
      nProgress.done();
    });

    return {
      fileList,
      openModal,
      closeModal,
      modal,
      onClick,
      image,
      data,
      date,
      imageListByCathegory,
      imagePlaceholder,
      result,
      genesSignatures,
      images,
    };
  },
};
</script>

<style lang="postcss" scoped>
.app-content h2:first-child {
  margin-bottom: var(--size-3);
}

.color--1,
.color--2,
.color--3 {
  --accordion-header-color: var(--ht-text-color-1-light);
  --accordion-panel-color: var(--ht-text-color-1-light);
}

.color {
  &--1 {
    background-color: var(--purple-3);
  }

  &--2 {
    background-color: var(--green-3);
  }

  &--3 {
    background-color: var(--indigo-3);
  }
}

.results {
  display: grid;

  grid-column-gap: 1.2em;
  grid-row-gap: 1.5em;
  grid-template-areas:
    'details'
    'chart'
    'notes'
    'downloads'
    'thumbnails-1'
    'thumbnails-2'
    'thumbnails-3';

  @media (min-width: 60em) {
    grid-template-columns: minmax(min-content, 30rem) 30rem;
    grid-template-areas:
      'details chart'
      'notes chart'
      'downloads downloads'
      'thumbnails-1 thumbnails-1'
      'thumbnails-2 thumbnails-2'
      'thumbnails-3 thumbnails-3';
  }

  .details {
    grid-area: details;
  }

  .details,
  .notes,
  .downloads {
    h2 {
      color: var(--ht-text-color-1);
      font-size: var(--font-size-4);
      margin-bottom: var(--size-2);
    }
  }

  .notes {
    grid-area: notes;

    p {
      max-height: 30rem;
      overflow-y: scroll;
    }
  }

  .chart {
    grid-area: chart;
  }

  .details,
  .notes,
  .chart {
    max-width: 30rem;
  }

  .downloads {
    grid-area: downloads;

    .buttons-container {
      display: flex;
      align-items: center;
      gap: var(--size-2);
      flex-direction: column;
      align-items: stretch;

      @media (min-width: 40em) {
        flex-direction: row;
      }
    }
  }

  .thumbnails-1 {
    grid-area: thumbnails-1;
  }

  .thumbnails-2 {
    grid-area: thumbnails-2;
  }

  .thumbnails-3 {
    grid-area: thumbnails-3;
  }

  .thumbnails__content {
    max-height: 30rem;
    overflow-y: scroll;
  }
}

.thumbnail {
  padding: 0.5rem;
  cursor: pointer;

  img {
    width: 100%;
    margin-bottom: var(--size-3);
  }

  p {
    text-align: center;
  }
}

.modal {
  & > header {
    position: relative;

    padding-right: 2rem;

    button {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
