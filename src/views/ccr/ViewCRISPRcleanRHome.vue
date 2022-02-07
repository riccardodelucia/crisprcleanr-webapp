<template>
  <BaseLayoutWebpage>
    <!-- <div class="ccr-background ccr-background--dna"></div> -->
    <div class="ccr-hero">
      <img
        class="ccr-hero__logo"
        src="@/assets/logos/ccr-logo.svg"
        alt="CRISPRcleanR logo"
      />
      <h1 class="ccr-hero__title">Welcome to CRISPRcleanR Web App</h1>
      <p class="ccr-hero__text">
        CRISPRcleanR is a tool for the unsupervised correction of
        gene-independent effects in CRISPR knockout screens encompassing
        pre-processing and normalization of single-guide RNA counts,
        pre/post-correction quality-control assessment and interactive
        visualizations.
      </p>
      <button
        @click="$router.push('/ccr/submit')"
        class="button button--primary button--large ccr-hero__btn--start"
        type="button"
      >
        Start Here
      </button>
      <button
        class="button button--ghost button--large ccr-hero__btn--download"
        type="button"
        @click="downloadSampleData"
      >
        Download Example Input Data
      </button>
    </div>
    <section class="ccr-section section-cards">
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
          results in the table and access them by clicking on the
          <b>eye</b> icon.
        </p>
      </div>
      <div class="card-step">
        <div class="card-step__icon-container card-step__icon-container--3">
          <BaseIcon name="eye" />
        </div>

        <h3>Step 3: explore and download your results</h3>
        <p>
          Explore all data and results related to your completed job
          <b>interactively</b>; <b>download</b> input data and results in
          tabular format, together with plots and images in different graphical
          formats.
        </p>
      </div>
    </section>
    <section class="ccr-section section-security">
      <h2>Your data in a secure place 🔐</h2>
      <p>
        Your data <b>privacy</b> is very important to us. To use CRISPRcleanR
        Web App you are required to authenticate. All the data you upload and
        submit, and related results are <b>protected</b> and accessible to
        <b>you only</b>.
      </p>
      <div class="disclaimer">
        <p>
          <b style="color: red">Disclaimer:</b><br />
          While the CRISPRcleanR Web App manuscript is under review, the
          authentication/secure-login system is bound to 3 pre-existing test
          accounts, which can be used to evaluate analytical capabilities and
          data/results protection level. A fully functional user registration
          system will be incorporated in the publicly disclosed version of
          CRISPRcleanR Web App.
        </p>
        <p>List of available test users:</p>
        <ul>
          <li><mark>test1@test.com | pwd: 1234</mark></li>
          <li><mark>test2@test.com | pwd: 1234</mark></li>
          <li><mark>test3@test.com | pwd: 1234</mark></li>
        </ul>
      </div>

      <img src="@/assets/img/login.png" alt="login form" />
    </section>
    <section class="ccr-section section-howitworks">
      <img src="@/assets/img/excel.png" alt="excel sheet" />
      <h2>How it works ⚙️</h2>
      <div class="section-howitworks__text">
        <p>
          To start you will need a plain <b>text file</b> containing individual
          single guide RNAs counts for at least three samples (the first one
          will be interpreted as derived from a <b>control condition</b>, for
          example plasmidic DNA). The format of this file should be
          <b>tab delimited</b> with one row per sgRNA and the following
          columns/headers:
        </p>
        <ul>
          <li>
            <b>sgRNA</b>: containing alphanumerical identifiers of the sgRNA
            under consideration
          </li>
          <li>
            <b>gene</b>: containing HGNC symbols of the genes targeted by the
            sgRNA under consideration
          </li>
        </ul>
        <p>
          followed by the columns containing the <b>sgRNAs' counts</b> for the
          controls and columns for <b>library</b> trasfected samples. Only
          single guide RNAs included in the selected library will be considered.
        </p>
      </div>
      <p class="section-howitworks__example">
        See, for example, the format of the
        <b>downloadable dataset</b> example input data at the top of this page.
        This data encompasses single guide RNA counts derived from screening the
        <b>HT-29</b> cell lines with the <b>KY_Library_v1.0</b> (which should be
        selected in the job submission form) and it is part of the
        <a href="https://score.depmap.sanger.ac.uk/ ">Project Score dataset</a>
        (<a href="https://score.depmap.sanger.ac.uk/">Dwane et al. 2021</a>,
        <a href="https://www.nature.com/articles/s41586-019-1103-9"
          >Behan et al. 2019</a
        >)
      </p>

      <BaseAccordion class="section-howitworks__accordion">
        <template v-slot:title>Step 1️⃣ : submit your job</template>
        <template v-slot:content>
          <div class="text-small">
            <div class="u-margin-bottom-small">
              <video controls width="1200">
                <source src="@/assets/videos/submission.mp4" type="video/mp4" />
              </video>
            </div>
            <p>
              CRISPRcleanR Web App allows you to submit your counts file in
              <b>.csv</b> and <b>.tsv</b> formats. Each new submission creates a
              new <b>Job</b>. A job relates to a submitted file along with all
              related results. Fill in the form with required data, click on
              <b>Next</b> and you are ready to go. The submitted job will be
              executed in background for you, in few minutes.
            </p>
            <p>
              You can decide whether to provide an <b>email</b> that will be
              used to let you know when the job is completed or to note down a
              direct link to the results
              <b>(URL revealed at the end of the submission stage)</b>. Your
              results will be nevertheless always accessible by clicking on the
              <b>Results</b> navigation button, on the left bar.
            </p>
          </div>
          <div class="text-small">
            <p>List of currently available input parameters:</p>
            <ul>
              <li><b>Title: </b>Give a memorable title to your job</li>
              <li>
                <b>Email (optional): </b>You can provide an email where to
                receive the job outcome upon finish
              </li>
              <li>
                <b>Data Label: </b>Choose a name for labels within charts
                produced by CRISPRcleanR
              </li>
              <li>
                <b>Library: </b>Choose the library used for the current
                experiment
              </li>
              <li>
                <b
                  >Minimal number of reads in the control sample (default 30): </b
                >This parameter defines a filtering threshold value for sgRNAs,
                based on their average counts in the control sample.
                Specifically, it indicates the minimal number of counts that
                each individual sgRNA needs to have in the controls (on average)
                in order to be processed by CRISPRcleanR
              </li>
              <li>
                <b>Number of controls (default 1): </b>number of controls used
                for a CRISPR screen
              </li>
              <li>
                <b>Normalization Method (default 'Counts Per Million'): </b>
                Normalisation method
              </li>
              <li>
                <b>Notes (optional): </b>Add your notes in this text field
              </li>
              <li>
                <b>File: </b>The input raw counts file to be pre-processed
                through CRISPRcleanR
              </li>
            </ul>
          </div>
        </template>
      </BaseAccordion>
      <BaseAccordion class="section-howitworks__accordion">
        <template v-slot:title
          >Step 2️⃣: identify and access your results</template
        >
        <template v-slot:content>
          <div class="text-small">
            <div class="u-margin-bottom-small">
              <video controls width="1200">
                <source src="@/assets/videos/results.mp4" type="video/mp4" />
              </video>
            </div>
            <p>
              Click on the <b>Results</b> navigation button on the left nav to
              access all your personal successfully computed and pending
              results.
            </p>
            <p>
              Results are conveniently <b>paginated</b>. You can navigate
              through the pages, as well as choosing the number of results per
              page.
            </p>
            <p>
              <b>Sort</b> results according to the available headers, and
              conveniently <b>retrieve</b> specific results with the search bar.
              Any data type of the table columns is a valid search parameter.
            </p>
          </div>
        </template>
      </BaseAccordion>

      <BaseAccordion class="section-howitworks__accordion">
        <template v-slot:title
          >Step 3️⃣: explore and download your results</template
        >
        <template v-slot:content>
          <div class="text-small">
            <div class="u-margin-bottom-small">
              <video controls width="1200">
                <source
                  src="@/assets/videos/result_by_id.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <p>
              Click on the <b>eye icon</b> on the results list to access its
              details on a <b>dedicated page</b>.
            </p>
            <p>
              All your job <b>details</b> will be conveniently listed on top of
              the page. Click on the buttons to <b>download</b> zip files
              containing the job data. The <b>data zip</b> contains all the
              <b>tabular results</b> produced by CRISPRcleanR Web App, as well
              as the submitted <b>input file</b>. Two further buttons allow you
              to download produced <b>images and charts</b>, available in
              <b>png</b> and <b>pdf</b> formats.
            </p>
            <p>
              Scroll over the page to visualize all related <b>charts</b>. When
              clicking on an image, a modal window appears, which loads an
              <b>interactive</b> version of the <b>chart</b>. <b>Hover</b> on
              the data points and use the provided <b></b> to get insight on
              your experiment pre-processed data.
            </p>
          </div>
        </template>
      </BaseAccordion>
    </section>
    <section class="ccr-section section-charts u-margin-bottom-huge">
      <h2>Interactive Charts 📊</h2>
      <p>
        By <b>clicking</b> on each <b>image thumbnail</b> on the job results
        page you will be able to access a magnified and interactively explorable
        version of it. Depending on which image component your mouse pointer
        will move over, a tooltip will reveal different data/results’ details.
      </p>
      <BaseAccordion class="u-margin-bottom-small">
        <template v-slot:title>Chart example</template>
        <template v-slot:content>
          <div class="text-small">
            <p class="u-margin-bottom-medium">
              Each chart comes with its own sets of <b>controls</b>. For
              instance, you can find <b>sliders</b> and <b>checkboxes</b> to
              control major layout settings. Many charts come with a
              <b>minified graph</b> or <b>context area</b> used to
              <b>zoom</b> in a specific area of the chart. Within the context/
              mingraph, click outside of the selected area to reset to full
              view.
            </p>
            <div class="u-margin-bottom-medium">
              <video controls width="1200">
                <source
                  src="@/assets/videos/boxplot_chart.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <div class="u-margin-bottom-medium">
              <video controls width="1200">
                <source src="@/assets/videos/chr_chart.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </template>
      </BaseAccordion>
    </section>
  </BaseLayoutWebpage>
</template>

<script>
import CcrAPI from "@/api/ccr.js";
import { download } from "@/composables/download.js";

export default {
  title: "CRISPRcleanR",
  name: "ViewCRISPRcleanRHome",

  methods: {
    downloadSampleData() {
      const filename = "HT-29@KY_Library_v1.0.tsv";
      return CcrAPI.getStaticResource(filename).then((response) => {
        download(response.data, filename);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ccr-hero {
  color: #fff;
  padding: 5rem 4rem;
  grid-column: 1 / -1;

  grid-template-columns: minmax(6rem, 1fr) repeat(2, 1fr);

  background-image: linear-gradient(
      to right bottom,
      rgba(#1f59a0, 0.9),
      rgba(#16355c, 0.9)
    ),
    url("../../assets/img/dna-unsplash.jpg");
  background-size: cover;

  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-columns:
    minmax(5rem, 1fr) repeat(8, minmax(min-content, 15rem))
    minmax(5rem, 1fr);
  column-gap: 3rem;
  row-gap: 2rem;

  &__logo {
    filter: brightness(0) invert(1);
    grid-column: 2 / 5;
    grid-row: 1/-1;
  }

  &__title {
    color: #fff;
    grid-column: 5 / 10;
    grid-row: 1 / 2;
    font-size: 6rem;
    line-height: 1;
  }

  &__text {
    grid-column: 5 / 10;
    grid-row: 2 / 3;
    line-height: 2.5;
    @media only screen and (max-width: 500px) {
      grid-column: 1 / -1;
      grid-row: 3/ 4;
    }
  }

  &__btn {
    &--start {
      grid-column: 5 / 7;
      grid-row: 3/ 4;

      @media only screen and (max-width: 500px) {
        grid-column: 1 / -1;
        grid-row: 4/ 5;
      }
    }
    &--download {
      grid-column: 7 / 9;
      grid-row: 3/ 4;
    }
  }
}

.ccr-section {
  grid-column: 2 / -2;
  margin-top: 8rem;
  padding-left: 2em;
  padding-right: 2em;
  row-gap: 5rem;
  column-gap: 4rem;
}

.section-cards {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  justify-items: center;

  .card-step {
    //text-align: center;
    width: 30rem;

    box-shadow: var(--shadow-1);
    padding: 1em 1.5em;
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
  grid-template-rows: min-content 1fr min-content;

  h2 {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
  }

  p {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
  }

  img {
    display: block;
    width: 100%;
    grid-row: 1 / -1;
    grid-column: 2 / 3;
    box-shadow: var(--shadow-1);
  }

  .disclaimer {
    grid-row: 3 / 4;
    grid-column: 1 / 2;
    align-self: end;
    font-size: 1.3rem;
    p {
      line-height: 1.5;
      margin-bottom: 1em;
    }

    li {
      margin-bottom: 1em;
    }
  }
}

.section-howitworks {
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: repeat(2, 1fr);

  h2 {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
  }

  img {
    width: 100%;
    grid-row: 1 / -1;
    grid-column: 1 / 2;
  }

  &__text {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
  }

  &__example {
    grid-row: 3 / 4;
    grid-column: 1 / -1;
  }

  &__accordion {
    grid-column: 1 / -1;
  }
}

.section-charts {
  display: grid;
}
</style>