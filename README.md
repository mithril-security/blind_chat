<a name="readme-top"></a>
<br />
<div align="center">
  <a href="https://github.com/mithril-security/blind_chat">
    <img src="https://github.com/mithril-security/blindai/raw/main/docs/assets/logo.png" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">BlindChat</h1>

[![Website][website-shield]][website-url]
[![Blog][blog-shield]][blog-url]
</div>

 <p align="center">
    <b>Making in-browser Conversational AI privacy-friendly</b><br /><br />
   <!-- 
    <a href="https://blindllama.mithrilsecurity.io/en/latest"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://aicert.mithrilsecurity.io/en/latest/docs/getting-started/quick-tour/">Get started</a>
    ·
    <a href="https://github.com/mithril-security/aicert/issues">Report Bug</a>
    ·
    <a href="https://github.com/mithril-security/aicert/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#-about-the-project">About the project</a></li>
    <li><a href="#-design">Design</a></li>
    <li><a href="#-Comparisons">Comparisons</a></li>
    <li><a href="#-roadmap">Roadmap</a></li>
    <li><a href="#-contributing">Contributing</a></li>
    <li><a href="#-get-in-touch">Contact</a></li>
  </ol>
</details>

## 📜 About the project

### Introduction

🐱 **BlindChat** is an open-source project to develop the **first fully in-browser privacy solution to make Conversational AI privacy-friendly**.

Most conversational AI interfaces today require users to send their data to AI providers who serve AI models as a Service. This poses privacy issues for users who **lose control over their data**. 

⚠️ Because data is a key asset to improve LLMs, **many solutions more or less implicitly fine-tune users’ data to improve their models**.

This creates privacy risks for users as LLMs might learn their data by heart. Carlini et al. [1] showed that LLMs such as GPT-J could learn at least 1% of their training set by heart.

🔐 BlindChat solves this issue as users have guarantees that their data remains private at all times and have full control over it, either by doing local inference or using secure isolated environments called secure enclaves.

### Demo

👩‍💻  You can try out BlindChat [here](mithrilsecurity.io/chat)!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🧑‍🎨 Design

### Principles

🤗 **BlindChat** is a fork from **Hugging Face Chat UI project**.

We modified the code so that various tasks usually handled by the server are done by the browser. This is to **ensure privacy** as we do not want to send user data to the server/AI provider as our solution **places the AI provider outside of our trust model**.

We offer two modes to ensure users’ data remains private:

#### On-device inference

With the on-device mode, the model is sent locally to the users’ browser, and **inference is performed on-device**.

This mode is **generally suitable for smaller models** as large models may require too much bandwidth and computational resources.

#### Zero-trust AI APIs with enclaves 

With the Zero-trust AI APIs mode, data is sent to a **secure environment** called an **enclave** containing the model for remote inference. 

These environments provide **end-to-end protection** through robust **isolation and verification**. User data is **never accessible in clear** to the AI provider admins. 

> You can find out more about Zero-trust AI APIs with enclaves in the [guide](https://blindllama.mithrilsecurity.io/en/latest/docs/concepts/hardened-systems/) we provide with our [BlindLlama project](https://blindllama.mithrilsecurity.io/en/latest/), which is the underlying technology for this mode of BlindChat.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📊 Comparisons

|                      | Client-side bandwidth requirements | Client-side computing requirements | Model capabilities | Privacy |
|----------------------|-----------------------------------|-----------------------------------|-------------------|---------|
| On-device prediction | High                              | High                              | Low               | High    |
| Regular AI APIs      | Low                               | Low                               | High              | Low     |
| Zero-trust AI APIs  | Low                               | Low                               | High              | High    |


**On-device predictions and Zero-trust AI APIs both provide privacy** contrary to most existing Conversational AI solutions that expose data to privacy risks.

**On-device prediction** has the advantage of providing the highest level of privacy as data does not leave the device but requires downloading models that are several hundreds of MBs to several GBs and require heavy memory and computing resources. For many users, this option will not be possible with larger, higher-performing models due to these device requirements. 

**Zero-trust AI APIs** are deployed remotely, meaning the size of models is not restricted by the specifications of user devices. Users are able to query large models while still having robust privacy guarantees.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🎯 Roadmap

⚠️ Currently, only on-device inference with transformers.js is supported. 

**Zero-trust AI API integration with BlindLlama is coming soon**, enabling BlindChat to leverage powerful models like Llama 2 70b with privacy guarantees.

Other planned features include:

- **Full in-browser indexing of documents for retrieval-based generation:** allows users to get responses based on private documents they have supplied
- **Web search:** allows users to get responses based on search engine results

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing

Here’s how you can help us make AI confidential:

### 🛠️ Code contribution

You can contribute our code by forking our project on [GitHub](https://github.com/mithril-security/blind_chat) and creating a new pull request. Make sure to detail the modifications you are suggesting in your pull request description.

### 🌎 Spread the word

Share our project on social media!

[![share-on-twitter][twitter]][twitter-share]
[![share-on-fb][fb-shield]][facebook-share]
[![share-on-reddit][reddit-shield]][reddit-share]
[![share-on-linkedin][linkedin-shield]][linkedin-share]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📇 Get in touch

We would love to hear your feedback or suggestions, here are the ways you can reach us:
  - Found a bug? [Open an issue!](https://github.com/mithril-security/blind_chat/issues)
  - Got a suggestion? [Join our Discord community and let us know!](https://discord.com/invite/TxEHagpWd4)
  - Set up [a one-on-one meeting](https://www.mithrilsecurity.io/contact) with a member of our team

Want to hear more about our work on privacy in the field AI?
- Check out our [blog](https://blog.mithrilsecurity.io/)
- Subscribe to our newsletter [here](https://blog.mithrilsecurity.io/)

Thank you for your support!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## References

[1] Carlini, N., Ippolito, D., Jagielski, M., Lee, K., Tramer, F., & Zhang, C. (2022). Quantifying Memorization Across Neural Language Models. ArXiv. /abs/2202.07646


<!-- MARKDOWN LINKS & IMAGES -->
[project-url]: https://github.com/mithril-security/blind_chat
[twitter-url]: https://twitter.com/MithrilSecurity
[contact-url]: https://www.mithrilsecurity.io/contact
[docs-shield]: https://img.shields.io/badge/Docs-000000?style=for-the-badge&colorB=555
[docs-url]: https://blindllama.mithrilsecurity.io/en/latest/
[license-shield]: https://img.shields.io/github/license/mithril-security/aicert.svg?style=for-the-badge
[contact]: https://img.shields.io/badge/Contact_us-000000?style=for-the-badge&colorB=555
[project]: https://img.shields.io/badge/Project-000000?style=for-the-badge&colorB=555
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white&colorB=555
[reddit-shield]: https://img.shields.io/badge/reddit-0077B5?style=for-the-badge&logo=reddit&logoColor=white&colorB=FF4500
[twitter]: https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white
[fb-shield]: https://img.shields.io/badge/Facebook-0077B5?style=for-the-badge&logo=facebook&logoColor=white&colorB=3b5998
[linkedin-url]: https://www.linkedin.com/company/mithril-security-company/
[website-url]: https://www.mithrilsecurity.io
[docs-url]: https://blindllama.mithrilsecurity.io/en/latest/
[website-shield]: https://img.shields.io/badge/website-000000?style=for-the-badge&colorB=555
[blog-url]: https://blog.mithrilsecurity.io/
[blog-shield]: https://img.shields.io/badge/Blog-000?style=for-the-badge&logo=ghost&logoColor=yellow&colorB=555
[facebook-share]: https://www.facebook.com/sharer/sharer.php?u=https%3A//github.com/mithril-security/blind_chat
[twitter-share]: https://twitter.com/intent/tweet?url=https://github.com/mithril-security/blind_chat&text=Check%20out%20the%20open-source%20project%20to%20build%20a%20private%20Conversational%20AI%20app%20running%20fully%20in-browser
[linkedin-share]: https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/mithril-security/blind_chat
[reddit-share]: https://www.reddit.com/submit?url=github.com%2Fmithril-security%2Fblind_chat&title=Private%20in-browser%20Conversational%20AI%20with%20BlindChat