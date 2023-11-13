---
description: "Learn about the principles and design of Blindchat: private conversational AI through remote enclave inference or on-device inference"
---

# 🧑‍🎨 Design

## Principles

🤗 **BlindChat** is a fork from [**Hugging Face Chat UI project**](https://huggingface.co/spaces/huggingchat/chat-ui).

We modified the code so that various tasks usually handled by the server are done by the browser. This is to **ensure privacy** as we do not want to send user data to the server/AI provider as our solution **places the AI provider outside of our trust model**.

## Philosophy

To make AI transparent and confidential, (almost) all of the logic is transported from the server-side to the client-side browser.

This ensures end-users’ privacy and gives them control over what happens to their data. For instance, the inference can be done locally using transformers.js, and conversations can be stored in the user's browser chat. This means the operators of the AI service are blind to the user's data, hence the name BlindChat!

Data is only sent server-side where our remote enclave mode is selected. With this mode, the server is deployed within a hardened and verifiable environment called an enclave which provides end-to-end protection and prevents external access. Not even the AI provider admins operating the enclave can read users’ data.

Note that while our hardened environments don’t fit in with all definitions of an “enclave”, we will use it for convenience’s sake here to describe an environment that allows a server to process data without exposing its contents to service providers.

## Private inference

We offer two modes to ensure users’ data remains private:

### BlindChat Local: on-device inference

![on-device-mode-dark](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/on-device-dark.png?raw=true#gh-dark-mode-only)
![on-device-mode-light](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/on-device-light.png?raw=true#gh-light-mode-only)

With BlindChat Local, the model is sent locally to the users’ browser, and **inference is performed on-device**.

This mode is **generally suitable for smaller models** as large models may require too much bandwidth and computational resources.

### BlindChat Enclave: Confidential AI APIs

![zero-trust-mode-dark](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/zero-trust-dark.png?raw=true#gh-dark-mode-only)
![zero-trust-mode-light](https://github.com/mithril-security/blind_chat/blob/main/docs/assets/zero-trust-light.png?raw=true#gh-light-mode-only)

With BlindChat Enclave, data is sent to a **secure environment** called an **enclave** containing the model for remote inference.

These environments provide **end-to-end protection** through robust **isolation and verification**. User data is **never accessible in clear** to the AI provider admins.

> You can find out more about Confidential and transparent AI APIs with enclaves in the [guide](https://blindllama.mithrilsecurity.io/en/latest/docs/concepts/hardened-systems/) we provide with our [BlindLlama project](https://blindllama.mithrilsecurity.io/en/latest/), which is the underlying technology for this mode of BlindChat.

## Architecture

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
