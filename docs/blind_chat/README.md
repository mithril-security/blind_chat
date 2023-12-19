<a name="readme-top"></a>
<br />

<div align="center">
  <a href="https://github.com/mithril-security/blind_chat">
    <img src="https://github.com/mithril-security/blindai/raw/main/docs/assets/logo.png" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">BlindChat</h1> 

[![Website][website-shield]][website-url]
[![Blog][blog-shield]][blog-url]
[![Docs][docs-shield]][docs-url]

</div>

 <p align="center">
    <b>Open-source and privacy-by-design alternative to ChatGPT</b><br /><br />
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
    <li><a href="#-roadmap">Roadmap</a></li>
    <li><a href="#-design">Design</a></li>
    <li><a href="#-comparisons">Comparisons</a></li>
    <li><a href="#-get-in-touch">Contact</a></li>
  </ol>
</details>

## 📜 About the project 

### What is BlindChat?

🐱 **BlindChat** is an open-source project to develop **the first fully in-browser and private Conversational AI**.

Most conversational AI solutions today require users to send their data to AI providers who serve AI models as a Service. This poses privacy issues for users who **lose control over their data**.

⚠️ Because data is a key asset to improve LLMs, **many solutions more or less implicitly fine-tune users’ data to improve their model**.

This creates privacy risks for users as LLMs might learn their data by heart. Carlini et al. [1] showed that LLMs such as GPT-J could learn at least 1% of their training set by heart.

🔐 BlindChat solves this issue as users have guarantees that their data remains private at all times and have full control over it, either by doing local inference or using secure isolated environments called secure enclaves.

### Local conversations

### Demo

![demo](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/demo_blind_chat.gif?raw=true)

#### 👩‍💻 You can try out BlindChat [here](https://chat.mithrilsecurity.io)!

We enable users to interact with a [Flan-T5 model](https://huggingface.co/docs/transformers/model_doc/flan-t5) locally through their browser: the model is pulled and used for local inference using [transformers.js](https://huggingface.co/docs/transformers.js/index).

### Who is BlindChat for?

BlindChat aims to serve two users:

- **End users:** We want to provide privacy-by-design alternatives to change the current status quo. Most users today are forced to give up their data to leverage AI services, and opaque or inexistent privacy controls are the norm.

- **Developers:** We want to help developers easily serve privacy-by-design Conversational AI, which is why we are focused on making BlindChat easy to customize and deploy.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

You can check out our progress in more detail on our [official roadmap](https://github.com/orgs/mithril-security/projects/2/views/4). We highlight feature on which we would love help from contributors in our [help wanted section](https://github.com/orgs/mithril-security/projects/2/views/3).

Roadmap quick summary:

- [x] Revamping of Hugging Face Chat UI to make it entirely client-side (removal of telemetry, data sharing, server-side history of conversations, server-side inference, etc.)
- [x] Integration of privacy-by-design inference with local model
- [x] Local caching of conversations
- [ ] Integration of more advanced local models (e.g. [phi-1.5](https://huggingface.co/microsoft/phi-1_5)) and more advanced inference (e.g. [Web LLM](https://github.com/mlc-ai/web-llm)) ⌛
- [ ] Integration of privacy-by-design inference with remote enclaves using BlindLlama for powerful models such as [Llama 2 70b](https://huggingface.co/meta-llama/Llama-2-70b-chat-hf) & [Falcon 180b](https://huggingface.co/tiiuae/falcon-180B) ⌛
- [ ] Integration with [LlamaIndex TS](https://github.com/run-llama/LlamaIndexTS) for local Retrieval Augmented Generation (RAG) ⌛
- [ ] Internet search ⌛
- [ ] Connectors to pull data from different sources ⌛

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🔧 Setup

Before going any further, please make sure you have [Node JS 18.0](https://nodejs.org/en) installed on your system.

To run the chat user interface in dev/debug mode for testing purposes, execute the following commands in the root folder of your BlindChat code repo.

```bash
npm install
npm run dev
```

This will install the dependencies of the project and launch the dev environment.

The chat can be deployed in production mode with the following commands:

```bash
npm run build
node build
```

The chat-ui uses server-side rendering, so building the pages before deploying them is mandatory.

> ⚠️ Note that the command `node build` will run the server in `HTTP mode`.
> If you wish to add TLS, please use a proxy server, such as NGINX.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🧑‍🎨 Design

### Principles

🤗 **BlindChat** is a fork from [**Hugging Face Chat UI project**](https://huggingface.co/spaces/huggingchat/chat-ui).

We modified the code so that various tasks usually handled by the server are done by the browser. This is to **ensure privacy** as we do not want to send user data to the server/AI provider as our solution **places the AI provider outside of our trust model**.

### Philosophy

To make AI transparent and confidential, (almost) all of the logic is transported from the server-side to the client-side browser.

This ensures end-users’ privacy and gives them control over what happens to their data. For instance, the inference can be done locally using transformers.js, and conversations can be stored in the user's browser chat. This means the operators of the AI service are blind to the user's data, hence the name BlindChat!

Data is only sent server-side where our remote enclave mode is selected. With this mode, the server is deployed within a hardened and verifiable environment called an enclave which provides end-to-end protection and prevents external access. Not even the AI provider admins operating the enclave can read users’ data.

Note that while our hardened environments don’t fit in with all definitions of an “enclave”, we will use it for convenience’s sake here to describe an environment that allows a server to process data without exposing its contents to service providers.

### Private inference

We offer two modes to ensure users’ data remains private:

#### BlindChat Local: On-device inference

![on-device-mode-dark](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/on-device-dark.png?raw=true#gh-dark-mode-only)
![on-device-mode-light](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/on-device-light.png?raw=true#gh-light-mode-only)

With BlindChat Local, the model is sent locally to the users’ browser, and **inference is performed on-device**.

This mode is **generally suitable for smaller models** as large models may require too much bandwidth and computational resources.

#### BlindChat Enclave: Confidential AI APIs with enclaves

![zero-trust-mode-dark](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/zero-trust-dark.png?raw=true#gh-dark-mode-only)
![zero-trust-mode-light](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/zero-trust-light.png?raw=true#gh-light-mode-only)

With BlindChat Enclave, data is sent to a **secure environment** called an **enclave** containing the model for remote inference.

These environments provide **end-to-end protection** through robust **isolation and verification**. User data is **never accessible in clear** to the AI provider admins.

> You can find out more about Confidential and transparent AI APIs with enclaves in the [guide](https://blindllama.mithrilsecurity.io/en/latest/docs/concepts/hardened-systems/) we provide with our [BlindLlama project](https://blindllama.mithrilsecurity.io/en/latest/), which is the underlying technology for this mode of BlindChat.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Architecture

The project currently has three major components:

- **UI:** This is the Chat interface that the end user interacts with. It contains the Chat box, and will contain plugins and other widgets for more complex interaction, such as loading documents or enabling voice commands.
- **Private LLM:** Developers can customize which LLM they choose to answer users’ queries. Current options are either local models or remote enclaves to ensure transparent and private inference.
- **Storage:** Developers can customize what kind of storage is used to save information such as conversation history and, in the future, embeddings for RAG.

**\*Coming soon:**

- **Connectors:** Connectors will allows users to pull documents from various sources, e.g. PDF upload, and share outputs
- **Integration with Llama Index TS:** This will allow users to index documents with local models, store them in local storage and use them for RAG (query the LLMs based on the information contained in their documents).

## 📊 Comparisons

|                      | Client-side bandwidth requirements | Client-side computing requirements | Model capabilities | Privacy |
| -------------------- | ---------------------------------- | ---------------------------------- | ------------------ | ------- |
| On-device prediction | High                               | High                               | Low                | High    |
| Regular AI APIs      | Low                                | Low                                | High               | Low     |
| Zero-trust AI APIs   | Low                                | Low                                | High               | High    |

**On-device predictions and Confidential AI APIs both provide privacy** contrary to most existing Conversational AI solutions that expose data to privacy risks.

**On-device prediction** has the advantage of providing the highest level of privacy as data does not leave the device but requires downloading models that are several hundreds of MBs to several GBs and require heavy memory and computing resources. For many users, this option will not be possible with larger, higher-performing models due to these device requirements.

**Confidential AI APIs** are deployed remotely, meaning the size of models is not restricted by the specifications of user devices. Users are able to query large models while still having robust privacy guarantees.

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
[docs-url]: https://blindchat.mithrilsecurity.io/en/latest/
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
