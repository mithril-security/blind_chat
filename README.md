<a name="readme-top"></a>
<br />

<div align="center">
  <a href="https://github.com/mithril-security/blind_chat">
    <img src="https://github.com/mithril-security/blindai/raw/main/docs/assets/logo.png" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">🔐 Confidential and trustable AI solutions </h1>

[![Website][website-shield]][website-url]
[![Blog][blog-shield]][blog-url]
[![Docs][docs-shield]][docs-url]

</div>

We are on a mission to **democratize confidential and trustable AI** through **enclave-based solutions**. **Enclaves** are secure computing environments that combine **confidentiality** and **verifiability** to protect critical data during analysis. Learn more about them [here](https://blind-chat.readthedocs.io/en/latest/docs/concepts/enclaves/)!


## What are our main solutions?

---

![our-solutions](docs/assets/blind-chat-llama-light.jpg#gh-light-mode-only)
![our-solutions-dark](docs/assets/blind-chat-llama-dark.jpg#gh-dark-mode-only)
### 🐱 BlindChat

**BlindChat** is a **confidential & verifiable Conversational AI**.

It is available via an easy-to-use web API similar to ChatGPT, Bard, or Claude, but with BlindChat, users have cryptographic guarantees that their prompts remain private from the AI provider (in this case Mithril Security). Not even our admins can access user data.

We achieve this by leveraging a **privacy-enhacing technology called enclaves** with our **underlying core solution, BlindLlama**.

Before each connection with BlindChat, we verify the system, providing **technical proofs** that:

- **we cannot see your data**
- **we cannot train on your data** 
- **we cannot leak your data.**

You can test BlindChat [here](https://chat.mithrilsecurity.io/).

![demo](./assets/demo_blind_chat.gif)

### 🦙 BlindLlama

**BlindLlama** is the core technology behind BlindChat. It enables AI providers to deploy easy-to-use AI APIs within a **privacy-by-design system** using **enclaves**. With BlindLlama, AI providers can provide **cryptograhic guarantees** that they will not be able to access user data. 

### 🐈 BlindChat Local

BlindChat Local is a variant of the BlindChat project, but instead of protecting user data by deploying our conversational AI server within an enclave - we eliminate the need for a remote server altogether! Instead, BlindChat Local operates entirely in your browser, using [transformers.js](https://github.com/xenova/transformers.js) for local inference and saving conversations in the browser cache - this means **your data never leaves your device**!

You can try BlindChat local [here](https://huggingface.co/spaces/mithril-security/blind_chat)

> Note that the models and performance with BlindChat Local are restricted by the user's device. For best performance, we recommend remote inference with our standard BlindChat solution.

### 📊 Comparisons

|                         | Client-side bandwidth requirements | Client-side computing requirements | Model capabilities | Privacy |
| --------------------    | ---------------------------------- | ---------------------------------- | ------------------ | ------- |
| ⭐ BlindChat with BlindLlama  | Low                                | Low                                | High               | High    |
| BlindChat Local         | High                               | High                               | Low                | High    |
| Regular AI APIs         | Low                                | Low                                | High               | ⚠️ Low     |


## Getting started
---

- [Try out BlindChat](https://chat.mithrilsecurity.io/)
- Discover the [technologies behind BlindChat](https://blind-chat.readthedocs.io/en/latest/docs/concepts/overview/)

## 📇 Get in touch

---

We would love to hear your feedback or suggestions, here are the ways you can reach us:

- Found a bug? [Open an issue!](https://github.com/mithril-security/blind_chat/issues)
- Got a suggestion? [Join our Discord community and let us know!](https://discord.com/invite/TxEHagpWd4)
- Set up [a one-on-one meeting](https://www.mithrilsecurity.io/contact) with a member of our team

Want to hear more about our work on privacy in the field AI?

- Check out our [blog](https://blog.mithrilsecurity.io/)
- Subscribe to our newsletter [here](https://blog.mithrilsecurity.io/)

Thank you for your support!

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
[docs-url]: https://blindchat.mithrilsecurity.io/en/latest/
[website-shield]: https://img.shields.io/badge/website-000000?style=for-the-badge&colorB=555
[blog-url]: https://blog.mithrilsecurity.io/
[blog-shield]: https://img.shields.io/badge/Blog-000?style=for-the-badge&logo=ghost&logoColor=yellow&colorB=555
[facebook-share]: https://www.facebook.com/sharer/sharer.php?u=https%3A//github.com/mithril-security/blind_chat
[twitter-share]: https://twitter.com/intent/tweet?url=https://github.com/mithril-security/blind_chat&text=Check%20out%20the%20open-source%20project%20to%20build%20a%20private%20Conversational%20AI%20app%20running%20fully%20in-browser
[linkedin-share]: https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/mithril-security/blind_chat
[reddit-share]: https://www.reddit.com/submit?url=github.com%2Fmithril-security%2Fblind_chat&title=Private%20in-browser%20Conversational%20AI%20with%20BlindChat
