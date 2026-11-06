# Estimate email setup

Once configured, the estimate form sends requests to `purehavendish@gmail.com` through Google Apps Script. Deploy the included `google-apps-script/Code.gs` from the Google account that should authorize sending the email.

1. Open [script.google.com](https://script.google.com/) and create a new project.
2. Replace the starter code with the contents of `google-apps-script/Code.gs`, then save.
3. Choose **Deploy → New deployment**, select **Web app**, set **Execute as** to **Me**, and set access to **Anyone**.
4. Deploy and complete Google's authorization prompts. Copy the web app URL ending in `/exec`.
5. In `script.js`, set `estimateScriptUrl` to the copied URL, for example:

   ```js
   const estimateScriptUrl = "https://script.google.com/macros/s/your-deployment-id/exec";
   ```

6. If you already deployed the earlier version, choose **Deploy → Manage deployments**, click the pencil icon, select **New version**, and click **Deploy** to update the Apps Script handler.
7. Publish the updated website and submit a test request.

The deployed web app is publicly reachable so the website can submit to it. Keep the form's honeypot field in place and review your Apps Script executions and Gmail if a request does not arrive.
