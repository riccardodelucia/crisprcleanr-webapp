<template>
  <div class="hero">
    <div class="hero__container">
      <div class="hero__logo"><img src="@/assets/logos/ccr-logo.svg" alt="CRISPRcleanR logo" /></div>

      <h1 class="hero__title">Welcome to CRISPRcleanR Web App (Beta)</h1>
      <p class="hero__text">
        CRISPRcleanR is a tool for the unsupervised correction of
        gene-independent effects in CRISPR knockout screens encompassing
        pre-processing and normalization of single-guide RNA counts,
        pre/post-correction quality-control assessment and interactive
        visualizations.
      </p>
      <div class="hero__button-container"><button @click="$router.push({ name: 'submit' })"
          class="button button--primary button--large hero__button--submit" type="button">
          Submit Job
        </button>
        <button @click="$router.push({ name: 'resultsList' })"
          class="button button--secondary button--large hero__button--results" type="button">
          Results
        </button>
        <button class="button button--ghost button--large hero__button--download" type="button"
          @click="downloadSampleData">
          Download Example Files
        </button>
      </div>
    </div>
  </div>
  <section class="section section-cards">
    <div class="card-step">
      <div>
        <div class="card-step__icon-container card-step__icon-container--1">
          <BaseIcon name="upload" />
        </div>
      </div>
      <h3>Step 1: submit your job</h3>
      <p>
        Click on the <b>Submit New Job</b> navigation button on the left bar,
        fill in the handy <b>form</b> with your experiment
        <b>metadata </b> and<b> details</b>, then click on the submit button.
        CRISPRcleanR will pre-process and analyze your data.
      </p>
    </div>
    <div class="card-step">
      <div>
        <div class="card-step__icon-container card-step__icon-container--2">
          <BaseIcon name="book-open" />
        </div>
      </div>
      <h3>Step 2: identify and access your results</h3>
      <p>
        When your job is <b>completed</b>, your results will be listed in a
        dedicated <b>table</b>, accessible by clicking on the
        <b>Results</b> navigation button on the left bar. Identify your job
        results in the table and access them by clicking on the <b>Show</b> button.
      </p>
    </div>
    <div class="card-step">
      <div class="card-step__icon-container card-step__icon-container--3">
        <BaseIcon name="eye" />
      </div>

      <h3>Step 3: explore and download your results</h3>
      <p>
        Explore all data and results related to your completed job
        <b>interactively</b>; <b>download</b> input data and results in tabular
        format, together with plots and images in different graphical formats.
      </p>
    </div>
  </section>
  <section class="section section-security">
    <div class="section-security__promo">
      <h2>Your data in a secure place 🔐</h2>
      <p>
        Your data <b>privacy</b> is very important to us. To use CRISPRcleanR Web App you need to create a user account
        and
        login. All the data you upload and submit and related results are <b>protected</b> and accessible to
        <b>you only</b>.
      </p>
      <p class="disclaimer">
        <b style="color: red">Disclaimer:</b><br />
        CRISPRclearR WebApp is in a beta-testing phase. For any info and bug report please contact the
        <a href="mailto: info_ioriolab@fht.org">Iorio Lab</a>.
        If you are a reviewer of the CRISPRcleanR WebApp manuscript, you will find your access credentials in the cover
        letter of our submission.
      </p>
    </div>
    <img src="@/assets/img/login.png" alt="login form" />
  </section>
  <section class="section section-howitworks">
    <h2>How it works ⚙️</h2>
    <div class="section-howitworks__text">
      <p>
        <b>CRISPRcleanR WebApp</b> allows to easily run CRISPRcleanR on your experimental data through an <b>easy-to-use
          interface</b>. New <b>jobs</b> can be submitted from the <router-link to="/submit">dedicated section
        </router-link> in the app.
        A <b>multi-step form</b> will guide you through the job submission, where all relevant information needs to be
        filled.
        Not only CRISPRcleanR WebApp natively supports a set of <b>6 built-in sgRNA libraries</b>, but it also provides
        the
        possibility of processing data generated with <b>any library</b> (by uploading the corresponding <b>annotation
          file</b>).
        Experimental CRISPR data can be provided either as <b>FASTQ/BAM files</b> or <b>pre-computed counts file</b>.
        Submitted jobs are available from the <router-link to="/submit">results section
        </router-link>. For each job, a <b>dedicated result page</b> is made available, where you can <b>download</b>
        all job-related data, together
        with static plots.
        Finally, a comprehensive set of <b>interactive charts</b> allows you to get insight over the outcome of your
        processed
        data.
      </p>
      <p>To start using CRISPRcleanR, follow along the videos provided in the following <b>step sections</b></p>.
      <p><b>Example data</b> can be <b>downloaded</b> from the current page and used to <b>submit test jobs</b>. A
        <b>README file</b> included in
        the example data allows you to better understand <b>accepted file formats and inner structure</b>
      </p>
    </div>
    <img src="@/assets/img/excel.png" alt="excel sheet" />
    <BaseAccordion class="section-howitworks__accordion">
      <template v-slot:title>Step 1️⃣ : submit your job</template>
      <template v-slot:content>
        <div class="text-small">
          <p>
            Check out this tutorial to know:
          </p>
          <ul class="u-margin-bottom-medium">
            <li>how to <b>sign in/register</b> to CRISPRcleanR Web App</li>
            <li>how to correctly fill in the <b>Job Submission Form</b></li>
            <li>the right <b>format</b> for your experimental data and <b>library files</b> (if you are using
              custom/external libraries).</li>
          </ul>
          <video controls class="section__video">
            <source src="@/assets/videos/submission.mp4" type="video/mp4" />
          </video>
        </div>
      </template>
    </BaseAccordion>
    <BaseAccordion class="section-howitworks__accordion">
      <template v-slot:title>Step 2️⃣: identify and access your results</template>
      <template v-slot:content>
        <div class="text-small">
          <p>
            Check out this tutorial to know:
          </p>
          <ul class="u-margin-bottom-medium">
            <li>how to access the <b>Results Section</b></li>
            <li>how to filter and retrieve specific results using the <b>data table controls</b></li>
          </ul>
          <video controls class="section__video">
            <source src="@/assets/videos/results.mp4" type="video/mp4" />
          </video>
        </div>
      </template>
    </BaseAccordion>

    <BaseAccordion class="section-howitworks__accordion">
      <template v-slot:title>Step 3️⃣: explore and download your results</template>
      <template v-slot:content>
        <div class="text-small">
          <p>
            Check out this tutorial to know:
          </p>
          <ul class="u-margin-bottom-medium">
            <li>how to <b>explore your results</b> through a range of <b>interactive plots</b> provided by CRISPRcleanR
              Web App</li>
            <li>how to <b>download</b> all the <b>job data and static plots</b> as zip files</li>
          </ul>
          <video controls class="section__video">
            <source src="@/assets/videos/result_by_id.mp4" type="video/mp4" />
          </video>
        </div>
      </template>
    </BaseAccordion>
  </section>
  <section class="section section-charts">
    <h2>Interactive Charts 📊</h2>
    <p>
      By <b>clicking</b> on each <b>image thumbnail</b> on the job results page
      you will be able to access a magnified and interactively explorable
      version of it. Depending on which image component your mouse pointer will
      move over, a tooltip will reveal different data/results’ details.
    </p>
    <BaseAccordion>
      <template v-slot:title>Chart example</template>
      <template v-slot:content>
        <div class="text-small">
          <p class="u-margin-bottom-medium">
            Each chart comes with its own sets of <b>controls</b>. For instance,
            you can find <b>sliders</b> and <b>checkboxes</b> to control general
            layout settings. Many charts come with a <b>minified version</b> of the chart
            (called )<b>context area</b>) used to <b>zoom</b> in a specific area of the
            chart. Within the context/ mingraph, click outside of the selected
            area to reset to full view.
          </p>

          <video controls class="section__video">
            <source src="@/assets/videos/charts.mp4" type="video/mp4" />
          </video>
        </div>
      </template>
    </BaseAccordion>
  </section>
</template>

<script>

import CcrAPI from "@/api/ccr.js";
import { download } from "@/composables/utilities.js";
import store from "@/store";


export default {
  title: "CRISPRcleanR",
  name: "ViewCRISPRcleanRHome",
  methods: {
    downloadSampleData() {
      const filename = "CRISPRcleanR_WebApp_example_files.zip";
      return CcrAPI.getStaticResource(filename).then((response) => {
        download(response.data, filename);
      }).catch((error) => {
        store.dispatch("notification/add", {
          type: "error",
          title: "Something went wrong... 💥",
          message: "Unable to download example files",
          timeout: 5,
        });
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.hero {
  color: #fff;
  padding: 5rem 0;
  grid-column: 1 / -1;

  background-image: linear-gradient(to right bottom,
      rgba(#1f59a0, 0.9),
      rgba(#16355c, 0.9)),
    url("../assets/img/dna-unsplash.jpg");
  background-size: cover;

  &__container {
    max-width: 150rem;
    padding: 5rem;
    margin: auto;
    display: grid;
    grid-template-columns: minmax(20rem, 1fr) repeat(2, 1fr); //3 columns to allow the logo occupy only 1/3 of the width;
    grid-template-rows: repeat(3, min-content);
    column-gap: 3rem;
    row-gap: 2rem;

    @media only screen and (max-width: 880px) {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
  }

  &__logo {
    grid-column: 1 / 2;
    grid-row: 1/ -1;
    display: flex;
    align-items: center;

    @media only screen and (max-width: 880px) {
      height: 20rem;
    }

    img {
      width: 100%;
      height: 100%
    }
  }

  &__title {
    color: #fff;
    grid-column: 2 / 5;
    font-size: 6rem;
    line-height: 1;

    @media only screen and (max-width: 800px) {
      grid-column: 1 / -1;
      grid-row: 2 / 3;
      font-size: 4rem;
    }
  }

  &__text {
    grid-column: 2 / 5;
    line-height: 2.5;

    @media only screen and (max-width: 800px) {
      grid-column: 1 / -1;
      grid-row: 3 / 4;
    }
  }

  &__button-container {
    grid-column: 2/ 4;
    display: flex;
    gap: 1em;
    justify-content: space-between;
    flex-wrap: wrap;

    .button {
      flex: 1 0 20rem;
    }
  }
}

.section {
  grid-column: 2 / -2;
  padding: 4rem 0;
  row-gap: 3rem;
  column-gap: 4rem;

  &__video {
    width: 100%;
    max-width: 1200px;
    margin-bottom: 2em;
  }
}

.section-cards {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  justify-items: center;

  @media only screen and (max-width: 880px) {
    display: flex;
    flex-direction: column;
  }

  .card-step {
    flex-grow: 1;
    box-shadow: var(--shadow-1);
    padding: 2em 1.5em;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    h3 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1.5rem;
      line-height: 1.8;
    }

    &__icon-container {
      margin: 0.5em auto;
      width: 5rem;
      height: 5rem;
      border-radius: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;

      &--1 {
        color: white;
        background-color: var(--color-blue);
      }

      &--2 {
        color: white;
        background-color: var(--color-blue-light);
      }

      &--3 {
        color: white;
        background-color: var(--color-blue-lighter);
      }
    }
  }
}

.section-security {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  &__promo {
    grid-column: 1 / 2;

    @media only screen and (max-width: 700px) {
      grid-column: 1 / -1;
    }
  }

  img {
    display: block;
    width: 100%;
    grid-column: 2 / 3;
    box-shadow: var(--shadow-1);

    @media only screen and (max-width: 700px) {
      grid-column: 1 / -1;
    }
  }

  .disclaimer {
    font-size: 1.5rem;
    line-height: 1.6;
    border: 2px solid red;
    padding: 0.5em;
  }
}

.section-howitworks {
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: repeat(2, 1fr);

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

    @media only screen and (max-width: 700px) {
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

  &__accordion {
    grid-column: 1 / -1;
  }
}

.section-charts {
  display: flex;
  flex-direction: column;
  gap: 2em;
  margin-bottom: 5em;
}
</style>
