---
description: "Discover BlindChat and BlindLlama: confidential and trustable AI solutions"
---

# 🔐 Confidential and trustable AI solutions  

## Welcome

We are **Mithril Security**, a startup on a mission to **democratize confidential and trustable AI** through **enclave-based solutions**. **Enclaves** are secure computing environments that combine **confidentiality** and **verifiability** to protect critical data during analysis. Learn more about them [here](./docs/concepts/enclaves)!


## What are our main solutions?

---

![our-solutions](./assets/blind-chat-llama-light.jpg#only-light)
![our-solutions-dark](./assets/blind-chat-llama-dark.jpg#only-dark)
### 🐱 BlindChat

**BlindChat** is a **confidential & verifiable Conversational AI**.

It is available via an easy-to-use web API similar to ChatGPT, Bard, or Claude, but with BlindChat, users have cryptographic guarantees that their prompts remain private from the AI provider (in this case Mithril Security). Not even our admins can access user data.

We achieve this by leveraging a **privacy-enhacing technology called enclaves** with our **underlying core solution, BlindLlama**.

Before each connection with BlindChat, we verify the system, providing **technical proofs** that:

- **we cannot see your data**
- **we cannot train on your data** 
- **we cannot leak your data.**

You can test BlindChat [here](https://chat.mithrilsecurity.io/).

<iframe width="560" height="315" src="https://www.youtube.com/embed/CNqStjJ7EVE?si=wKz_Yg_NBKOaotF6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

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
- Learn more about [how we protect your data](docs/getting-started/how-we-protect-your-data.md)
- Discover the [technologies behind BlindChat](docs/concepts/overview.md)

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
