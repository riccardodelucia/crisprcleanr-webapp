<template>
  <WebLayout>
    <div class="ht-wrapper ht-layout-stack text-wrapper">
      <h1>
        CRISPRcleanR WebApp
        <br />
        <span>
          Information on the processing of personal data pursuant to Article 13
          of Regulation (EU) 2016/679 of the European Parliament and of the
          Council
        </span>
      </h1>

      <p>
        <b>Human Technopole Foundation</b>, with registered
        offices in Viale Rita Levi-Montalcini 1, 20157, Milano (MI), Italia,
        Tel. +39/02 30247001, e-mail:
        <a href="mailto:dpo@fht.org">dpo@fht.org.</a>
        (hereinafter, also “<b>HT</b>” or “<b>Foundation</b>” or “<b>Data Controller</b>”), makes available to
        all interested users (hereinafter, also “<b>Users</b>” and, individually “<b>User</b>” or “<b>Data subjects</b>”
        and, individually “<b>Data subject</b>”), a
        WebApp, named “CRISPRcleanR Web App (Beta)”, aimed at allowing users,
        free of charge, the unsupervised correction of gene-independent effects
        in CRISPR knockout screens encompassing pre-processing and normalization
        of single-guide RNA counts, pre/post-correction quality-control
        assessment and interactive visualizations (hereinafter, also “<b>WebApp</b>”).
      </p>

      <p>
        Human Technopole, in the role of Data Controller, provides, with this
        document, the privacy information (hereinafter, "<b>Information</b>"), pursuant to articles 13 of Regulation (EU)
        2016/679 (hereinafter,
        also "GDPR") and of Legislative Decree 196/2003, as amended by
        Legislative Decree 101/2018 (hereinafter, "<b>Privacy Code</b>"), to the data subjects whose personal data are
        processed within the
        WebApp.
      </p>

      <p>
        The Foundation, as a Data Controller, will process the data in
        compliance with the principles of correctness, lawfulness and
        transparency, pursuant to art. 5 of the GDPR, and further national and
        community provisions on the protection of personal data.
      </p>

      <h2>
        Contacts of the Data Protection Officer (“DPO”)
      </h2>
      <p>
        The Data Protection Officer can be contacted at the following e-mail
        address:
        <a href="mailto:dpo@fht.org">dpo@fht.org.</a>
      </p>

      <h2>
        Purposes and legal basis of the data processing
      </h2>
      <p>
        The WebApp allows the user to access to a Reserved Area by entering his
        username and password.
      </p>
      <p>
        Once the Reserved area has been accessed, a useful form is made
        available to the user to:
      </p>
      <ul>
        <li>
          submit his job with the experiment metadata and details (clicking on
          the button “Submit”);
        </li>
        <li>
          identify and access his results (clicking on the button “Results”).
        </li>
      </ul>
      <p>
        When the user submits his job, he can optionally choose to receive job's
        results at his registered e-mail address.
      </p>
      <p>
        Personal data are processed by HT exclusively to offer a service to the
        data subject. If the data subject does not provide the data, HT will not
        be able to open the user account and offer its services.
      </p>
      <p>
        The legal basis of the processing, therefore, consists of the need to
        execute the request of the data subject, in compliance with Article 6,
        paragraph 1, letter b) of the GDPR.
      </p>
      <p>
        The provision of personal data by the data subject (authentication
        credentials) is necessary, as failure to provide it would make it
        impossible to activate the service. The provision of the e-mail by the
        user is optional.
      </p>

      <h2>Nature of the data processed</h2>
      <p>HT collects the following personal data:</p>
      <ul>
        <li>
          Authentication credentials (username and related password);
        </li>
        <li>E-mail address.</li>
      </ul>
      <p>
        HT processes the data to provide to the data subject the authenticated
        access to the HT services.
      </p>

      <h2>
        Recipients or categories of recipients of the personal data
      </h2>
      <p>
        No personal data communicated by users will be communicated to third
        parties, unless the communication is required by law or is strictly
        necessary for the fulfillment of regulatory obligations.
      </p>
      <p>
        Without prejudice to communications made in compliance with legal
        obligations, the personal data of the data subjects may be known,
        exclusively for the purposes listed in this Information, by:
      </p>
      <ul>
        <li>
          employees and collaborators of the Data Controller, as authorized
          personnel for data processing ("Authorized subjects"), acting on Data
          Controller’s behalf and instructions (for all user account data).
        </li>
        <li>
          third parties appointed by the Data Controller as Data Processor for
          the processing of personal data, pursuant to art. 28 of the GDPR. Data
          Processors are only provided with the information necessary to perform
          the services requested by the Data Controller, in compliance with the
          regulatory provisions and through the adoption of all necessary
          measures to protect the personal data of the data subjects.
        </li>
      </ul>

      <h2>Data retention period</h2>
      <p>
        Personal data are stored for as long as the account is open. Thereafter,
        the storage is prolonged for as long as the service is live, even if
        data subjects stop using the services. This prolongation is necessary to
        ensure legal compliance and security and to facilitate internal and
        external audits it they arise.
      </p>

      <h2>
        Transfer of personal data to a third country or international
        organization
      </h2>
      <p>
        Personal data will be stored and processed within the European Union.
      </p>
      <p>
        In the event of any processing of personal data outside the European
        Union, the same will only take place after the adoption of adequate
        guarantees, as required by national and EU legislation.
      </p>

      <h2>Rights of the data subjects</h2>
      <p>
        Data subjects have the right to obtain access to their personal data and
        the correction or cancellation of such data or the limitation of the
        processing that concerns them or to oppose the data processing, as
        provided by the GDPR.
      </p>

      <h2>
        Complaint to the Supervisory Authority
      </h2>
      <p>
        Data subjects have the right to lodge a complaint to the Supervisory
        Authority, pursuant to Article 77 of the GDPR, if they think that the
        processing of their data violates the provisions of the GDPR.
      </p>

      <h2>Contacts</h2>
      <p>
        To exercise the rights provided for by the GDPR, data subjects may
        contact the reference Foundation, at the address given in the
        introduction, or contact the Data Protection Officer of HT, at the
        following e-mail
        <a href="mailto:dpo@fht.org">dpo@fht.org.</a>
      </p>

      <p>
        <i>This Privacy Policy is updated to April 14, 2022.</i>
      </p>
      <div class="ht-center-2d button-container">
        <router-link :to="{ name: 'home' }" class="ht-button">
          Back to Home
        </router-link>
      </div>
    </div>
  </WebLayout>
</template>

<script>
import WebLayout from '@/layouts/WebLayout.vue';

export default {
  name: 'ViewCRISPRcleanRTermsDataProcessing',
  components: { WebLayout },
};
</script>

<style lang="postcss" scoped>
h1 {
  font-size: var(--font-size-7);
  line-height: var(--font-lineheight-00);
  margin-bottom: var(--size-8);

  span {
    font-size: var(--font-size-5);
  }
}

.text-wrapper {
  margin-top: var(--size-10);
  margin-bottom: var(--size-6);
  text-align: center;
  --width: 60ch;
}

h2 {
  font-size: var(--font-size-5);
  line-height: var(--font-lineheight-1);
}

p,
ul,
ol {
  text-align: justify;
}

.button-container {
  margin-top: var(--size-10);
  margin-bottom: var(--size-8);
}
</style>