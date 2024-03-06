<template>
  <WebLayout>
    <section class="section-hero">
      <div class="hero ht-wrapper">
        <img src="@/assets/logos/ccr-webapp-logo.svg" alt="CRISPRcleanR logo" />
        <article class="ht-layout-stack">
          <h1>Welcome to CRISPRcleanR Web App</h1>
          <p>
            CRISPRcleanR WebApp is an interactive, user-friendly web application
            to CRISPRcleanR: a tool for the unsupervised correction of
            gene-independent effects in CRISPR knockout screens encompassing
            pre-processing and normalization of single-guide RNA counts,
            pre/post-correction quality-control assessment and interactive
            visualizations.
          </p>
          <p>
            Publication:
            <a
              target="_blank"
              href="https://doi.org/10.1016/j.crmeth.2022.100373"
              >Vinceti, De Lucia et al. Cell Rep Methods. 2023
            </a>
          </p>
        </article>
        <nav>
          <router-link :to="{ name: 'submit' }" class="ht-button">
            Submit New Job
          </router-link>
          <router-link
            :to="{ name: 'resultsList' }"
            class="ht-button"
            data-type="secondary"
          >
            Results
          </router-link>
          <a class="ht-button" data-type="ghost" @click="downloadSampleData">
            Example Input Files
          </a>
        </nav>
      </div>
    </section>
    <div class="ht-wrapper ht-layout-stack">
      <section class="section-cards">
        <article class="ht-card ht-container ht-layout-stack">
          <div class="step-icon" data-step="1">
            <vue-feather type="upload" />
          </div>
          <h2>Step 1: submit your job</h2>
          <p>
            Click on the
            <b>Submit New Job</b> navigation button on the left bar, fill in the
            handy <b>form</b> with your experiment <b>metadata</b> and
            <b>details</b>, then click on the submit button. CRISPRcleanR will
            pre-process and analyze your data.
          </p>
        </article>
        <article class="ht-card ht-container ht-layout-stack">
          <div class="step-icon" data-step="2">
            <vue-feather type="book-open" />
          </div>
          <h2>Step 2: identify and access your results</h2>
          <p>
            When your job is <b>completed</b>, your results will be listed in a
            dedicated <b>table</b>, accessible by clicking on the
            <b>Results</b> navigation button on the left bar. Identify your job
            results in the table and access them by clicking on the
            <b>Show</b> button.
          </p>
        </article>
        <article class="ht-card ht-container ht-layout-stack">
          <div class="step-icon" data-step="3">
            <vue-feather type="eye" />
          </div>
          <h2>Step 3: explore and download your results</h2>
          <p>
            Explore all data and results related to your completed job
            <b>interactively</b>; <b>download</b> input data and results in
            tabular format, together with plots and images in different
            graphical formats.
          </p>
        </article>
      </section>
      <section class="section-grid section-security">
        <div class="ht-layout-stack">
          <h2>Your data in a secure place 🔐</h2>
          <p>
            Your data <b>privacy</b> is very important to us. To use
            CRISPRcleanR WebApp you need to create a user account and login. All
            the data you upload and submit and related results are
            <b>protected</b> and accessible to <b>you only</b>.
          </p>
        </div>

        <img src="@/assets/img/login.png" alt="login form" />
      </section>
      <section class="section-grid section-how-it-works">
        <div class="ht-layout-stack">
          <h2>How it works ⚙️</h2>
          <p>
            <b>CRISPRcleanR WebApp</b> allows to easily run CRISPRcleanR on your
            experimental data through an <b>easy-to-use interface</b>. New
            <b>jobs</b> can be submitted from the
            <router-link :to="{ name: 'submit' }"
              >dedicated section</router-link
            >
            in the app. A <b>multi-step form</b> will guide you through the job
            submission, where all relevant information needs to be filled. Not
            only CRISPRcleanR WebApp natively supports a set of
            <b>6 built-in sgRNA libraries</b>, but it also provides the
            possibility of processing data generated with <b>any library</b> (by
            uploading the corresponding <b>annotation file</b>). Experimental
            CRISPR data can be provided either as <b>FASTQ/BAM files</b> or
            <b>pre-computed counts file</b>. Submitted jobs are available from
            the
            <router-link :to="{ name: 'resultsList' }"
              >results section</router-link
            >. For each job, a <b>dedicated result page</b> is made available,
            where you can <b>download</b> all job-related data, together with
            static plots. Finally, a comprehensive set of
            <b>interactive charts</b> allows you to get insight over the outcome
            of your processed data.
          </p>
          <p>
            To start using CRISPRcleanR, follow along the videos provided in the
            following <b>step sections</b>.
          </p>
          <p>
            <b>Example input files</b> can be <b>downloaded</b> from the current
            page and used to <b>submit test jobs</b>. A
            <b>README file</b> included in the example data allows you to better
            understand
            <b>accepted file formats and their inner structure</b>
          </p>
        </div>
        <img src="@/assets/img/multistep-form.png" alt="Multistep form" />
      </section>
      <section class="ht-layout-stack">
        <ht-accordion :heading-level="2">
          <template #header>
            <span>Step 1️⃣: submit your job</span>
          </template>
          <template #panel>
            <div class="ht-layout-stack">
              <p>Check out this tutorial to learn:</p>
              <ul>
                <li>how to <b>sign in/register</b> to CRISPRcleanR Web App</li>
                <li>
                  how to correctly fill in the
                  <b>Job Submission Form</b>
                </li>
                <li>
                  the right <b>format</b> for your experimental data and
                  <b>library files</b> (if you are using custom/external
                  libraries).
                </li>
              </ul>
              <video controls class="section__video">
                <source
                  src="@/assets/videos/step_1_compressed.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </template>
        </ht-accordion>
        <ht-accordion :heading-level="2">
          <template #header>
            <span>Step 2️⃣: identify and access your results</span>
          </template>
          <template #panel>
            <div class="ht-layout-stack">
              <p>Check out this tutorial to learn:</p>
              <ul>
                <li>how to access the <b>Results Section</b></li>
                <li>
                  how to filter and retrieve specific results using the
                  <b>data table controls</b>
                </li>
              </ul>
              <video controls class="section__video">
                <source
                  src="@/assets/videos/step_2_compressed.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </template>
        </ht-accordion>
        <ht-accordion :heading-level="2">
          <template #header>
            <span> Step 3️⃣: explore and download your results </span>
          </template>
          <template #panel>
            <div class="ht-layout-stack">
              <p>Check out this tutorial to learn:</p>
              <ul>
                <li>
                  how to <b>explore your results</b> through a range of
                  <b>interactive plots</b> provided by CRISPRcleanR Web App
                </li>
                <li>
                  how to <b>download</b> all the
                  <b>job data and static plots</b> as zip files
                </li>
              </ul>
              <video controls class="section__video">
                <source
                  src="@/assets/videos/step_3_compressed.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </template>
        </ht-accordion>
      </section>
    </div>
  </WebLayout>
</template>

<script>
import CcrAPI from '@/api/ccr.js';

import { download } from '../utils.js';

import WebLayout from '@/layouts/WebLayout.vue';

import nProgress from 'nprogress';

export default {
  title: 'CRISPRcleanR',
  name: 'ViewCRISPRcleanRHome',
  components: { WebLayout },
  errorCaptured() {
    nProgress.done();
    return true;
  },
  methods: {
    downloadSampleData() {
      nProgress.start();
      const filename = 'CRISPRcleanR_WebApp_example_files.zip';

      return CcrAPI.getStaticResource(filename).then((response) => {
        download(response.data, filename);
        nProgress.done();
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
section {
  margin-bottom: var(--size-10);
}

h2 {
  font-size: var(--font-size-5);
  color: var(--ht-text-color-2);
}

video {
  max-width: 100%;
}

.section-hero {
  color: #fff;
  background-image: linear-gradient(
      to right bottom,
      rgba(31, 89, 160, 0.9),
      rgba(22, 53, 92, 0.9)
    ),
    url('/src/assets/img/dna-unsplash.jpg');
  background-size: cover;

  .hero {
    display: grid;
    grid-template-areas:
      'image'
      'article'
      'links';

    gap: 1rem;
    color: white;
    place-content: center;
    justify-content: center;
    align-content: center;
    padding-block: 2em;
    text-align: center;

    justify-items: center;
    align-items: center;

    img {
      width: 60%;
      grid-area: image;
    }

    article {
      grid-area: article;
      font-size: var(--font-size-3);

      h1 {
        font-size: var(--font-size-7);
      }
    }

    nav {
      display: flex;
      justify-self: stretch;
      flex-direction: column;
      grid-area: links;
      gap: var(--size-2);

      > * {
        flex: 1;
      }
    }

    @media (min-width: 55em) {
      grid-template-areas:
        'image article'
        'image links';
      grid-template-columns: 1fr 2fr;
      text-align: left;
      justify-items: left;
      grid-row-gap: 3rem;

      img {
        width: 100%;
      }

      nav {
        flex-direction: row;
      }
    }
  }
}

.section-cards {
  display: grid;
  gap: 1rem;

  @media (min-width: 55em) {
    grid-template-columns: repeat(3, minmax(10rem, 1fr));
  }

  article {
    box-shadow: var(--shadow-3);

    h2 {
      font-size: var(--font-size-3);
      text-align: center;
      line-height: var(--font-lineheight-1);
    }
  }
}

.step-icon {
  width: 3.5rem;
  height: 3.5rem;
  margin: auto;
  margin-bottom: var(--size-3);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  padding: var(--size-3);
  color: white;

  &[data-step='1'] {
    background-color: var(--blue-5);
  }

  &[data-step='2'] {
    background-color: var(--blue-7);
  }

  &[data-step='3'] {
    background-color: var(--blue-9);
  }
}

.section-grid {
  display: grid;

  gap: var(--size-8);

  place-items: center;

  grid-template-areas:
    'info'
    'image';

  img {
    box-shadow: var(--shadow-3);
  }

  & > *:first-child {
    grid-area: info;
  }

  & > *:last-child {
    grid-area: image;
  }

  @media (min-width: 55em) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 'info image';
  }

  p {
    max-width: 70ch;
  }
}

.section-security {
  @media (min-width: 55em) {
    grid-template-areas: 'info image';
  }
}

.section-how-it-works {
  @media (min-width: 55em) {
    grid-template-areas: 'image info';
  }
}
</style>
