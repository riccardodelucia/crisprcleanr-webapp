<template>
  <WebLayout>
    <section class="section-hero antialiased">
      <div class="hero web-container">
        <img
          class="hero__logo"
          src="@/assets/logos/ccr-webapp-logo.svg"
          alt="CRISPRcleanR logo"
        />
        <div class="hero__text-container">
          <h1>Welcome to CRISPRcleanR Web App</h1>
          <p class="text--md">
            CRISPRcleanR WebApp is an interactive, user-friendly web application
            to CRISPRcleanR: a tool for the unsupervised correction of
            gene-independent effects in CRISPR knockout screens encompassing
            pre-processing and normalization of single-guide RNA counts,
            pre/post-correction quality-control assessment and interactive
            visualizations.
          </p>
        </div>

        <div class="btns-group">
          <button
            class="btn btn--primary btn--md"
            type="button"
            @click="$router.push({ name: 'submit' })"
          >
            Submit New Job
          </button>

          <button
            class="btn btn--secondary btn--md"
            type="button"
            @click="$router.push({ name: 'resultsList' })"
          >
            Results
          </button>
          <button
            class="btn btn--ghost btn--md"
            type="button"
            @click="downloadSampleData"
          >
            Example Input Files
          </button>
        </div>
      </div>
    </section>
    <div class="web-container">
      <section class="section-grid margin-top--xl">
        <div class="card card-step">
          <div class="card-step__icon card-step__icon--1">
            <vue-feather type="upload" />
          </div>
          <h4>Step 1: submit your job</h4>
          Click on the <b>Submit New Job</b> navigation button on the left bar,
          fill in the handy <b>form</b> with your experiment
          <b>metadata </b> and<b> details</b>, then click on the submit button.
          CRISPRcleanR will pre-process and analyze your data.
        </div>
        <div class="card card-step">
          <div class="card-step__icon card-step__icon--2">
            <vue-feather type="book-open" />
          </div>
          <h4>Step 2: identify and access your results</h4>

          When your job is <b>completed</b>, your results will be listed in a
          dedicated <b>table</b>, accessible by clicking on the
          <b>Results</b> navigation button on the left bar. Identify your job
          results in the table and access them by clicking on the
          <b>Show</b> button.
        </div>
        <div class="card card-step">
          <div class="card-step__icon card-step__icon--3">
            <vue-feather type="eye" />
          </div>
          <h4>Step 3: explore and download your results</h4>

          Explore all data and results related to your completed job
          <b>interactively</b>; <b>download</b> input data and results in
          tabular format, together with plots and images in different graphical
          formats.
        </div>
      </section>
      <section class="section-grid margin-top--xxl">
        <div>
          <h2>Your data in a secure place 🔐</h2>
          <p>
            Your data <b>privacy</b> is very important to us. To use
            CRISPRcleanR WebApp you need to create a user account and login. All
            the data you upload and submit and related results are
            <b>protected</b> and accessible to <b>you only</b>.
          </p>
        </div>
        <img
          class="section-img"
          src="@/assets/img/login.png"
          alt="login form"
        />
      </section>
      <section class="section-grid margin-top--lg">
        <div>
          <h2>How it works ⚙️</h2>
          <p>
            <b>CRISPRcleanR WebApp</b> allows to easily run CRISPRcleanR on your
            experimental data through an <b>easy-to-use interface</b>. New
            <b>jobs</b> can be submitted from the
            <router-link to="/submit">dedicated section </router-link> in the
            app. A <b>multi-step form</b> will guide you through the job
            submission, where all relevant information needs to be filled. Not
            only CRISPRcleanR WebApp natively supports a set of
            <b>6 built-in sgRNA libraries</b>, but it also provides the
            possibility of processing data generated with <b>any library</b> (by
            uploading the corresponding <b>annotation file</b>). Experimental
            CRISPR data can be provided either as <b>FASTQ/BAM files</b> or
            <b>pre-computed counts file</b>. Submitted jobs are available from
            the <router-link to="/submit">results section</router-link>. For
            each job, a <b>dedicated result page</b> is made available, where
            you can <b>download</b> all job-related data, together with static
            plots. Finally, a comprehensive set of
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
        <img
          class="section-img"
          src="@/assets/img/multistep-form.png"
          alt="Multistep form"
        />
      </section>
      <section class="margin-top--lg margin-bottom">
        <ht-accordion
          label="Step 1️⃣ : submit your job"
          class="section-howitworks__accordion"
        >
          <div class="margin-bottom--lg">
            <p>Check out this tutorial to learn:</p>
            <ul>
              <li>how to <b>sign in/register</b> to CRISPRcleanR Web App</li>
              <li>how to correctly fill in the <b>Job Submission Form</b></li>
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
        </ht-accordion>
        <ht-accordion
          label="Step 2️⃣: identify and access your results"
          class="section-howitworks__accordion"
        >
          <div class="margin-bottom--lg">
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
        </ht-accordion>

        <ht-accordion
          label="Step 3️⃣: explore and download your results"
          class="section-howitworks__accordion"
        >
          <div class="margin-bottom--lg">
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
        </ht-accordion>
      </section>
    </div>
  </WebLayout>
</template>

<script>
import CcrAPI from '@/api/ccr.js';
import {
  download,
  parseErrorMesssage,
} from '@computational-biology-web-unit/ht-vue';

import { sendErrorNotification } from '../notifications';

import WebLayout from '@/layouts/WebLayout.vue';
export default {
  title: 'CRISPRcleanR',
  name: 'ViewCRISPRcleanRHome',
  components: { WebLayout },
  methods: {
    downloadSampleData() {
      const filename = 'CRISPRcleanR_WebApp_example_files.zip';
      return CcrAPI.getStaticResource(filename)
        .then((response) => {
          download(response.data, filename);
        })
        .catch((error) => {
          const message = parseErrorMesssage(error);
          sendErrorNotification({
            title: 'Unable to download sample data',
            message,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.section-grid {
  display: grid;
  grid-gap: var(--space-md);

  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  justify-items: center;

  & > * {
    min-width: 30rem;
  }
}

.section-hero {
  color: #fff;
  background-image: linear-gradient(
      to right bottom,
      rgba(#1f59a0, 0.9),
      rgba(#16355c, 0.9)
    ),
    url('../assets/img/dna-unsplash.jpg');
  background-size: cover;
  padding: 5rem 0;
}

.hero {
  display: grid;
  grid-template-columns: minmax(20rem, 1fr) repeat(2, 1fr); //3 columns to allow the logo occupy only 1/3 of the width;
  grid-template-rows: repeat(2, min-content);
  column-gap: 3rem;
  color: #fff;

  @media only screen and (max-width: 880px) {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  img {
    grid-column: 1 / 2;
    grid-row: 1/ -1;
    width: 100%;
    height: 100%;

    @media only screen and (max-width: 880px) {
      height: 20rem;
    }
  }

  &__text-container {
    grid-column: 2 / -1;

    h1 {
      color: inherit;
    }

    @media only screen and (max-width: 800px) {
      grid-column: 1 / -1;
      grid-row: 2 / 3;
    }
  }

  .btns-group {
    grid-column: 2 / -1;
  }
}

.card-step {
  min-width: 20rem;

  &__icon {
    width: 5rem;
    height: 5rem;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    padding: var(--component-padding);
    color: white;

    &--1 {
      background-color: var(--color-blue-dark);
    }

    &--2 {
      background-color: var(--color-blue);
    }

    &--3 {
      background-color: var(--color-blue-light);
    }
  }
}

.section-img {
  width: 100%;
  max-width: 40rem;
  box-shadow: var(--shadow-medium);
  justify-self: start;
}

.section-howitworks {
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 5rem;

  h2 {
    grid-row: 1 / 2;
    grid-column: 2 / 3;

    @media only screen and (max-width: 700px) {
      grid-column: 1 / -1;
    }
  }

  img {
    width: 100%;
    grid-row: 1 / -1;
    grid-column: 1 / 2;
    box-shadow: var(--shadow--medium);

    @media only screen and (max-width: 880px) {
      width: 100%;
    }

    @media only screen and (max-width: 700px) {
      width: 100%;
      grid-column: 1 / -1;
      grid-row: 3 / 4;
    }
  }

  &__text {
    grid-row: 2 / 3;
    grid-column: 2 / 3;

    @media only screen and (max-width: 700px) {
      grid-column: 1 / -1;
    }
  }
}
</style>
