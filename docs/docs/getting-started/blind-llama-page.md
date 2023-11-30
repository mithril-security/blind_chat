# Architecture
________________________________________________________

BlindLlama is composed of two main parts:

1. An **open-source client-side Python SDK** that verifies the remote Zero-trust AI models we serve are indeed guaranteeing data sent is not exposed to us.
2. An **open-source server** made up of three key components which work together to serve models without any exposure to the AI provider (Mithril Seucirty). We remove all potential server-side leakage channels from network to logs and provide cryptographic proof that those privacy controls are in place using [TPMs](../concepts/TPMs.md).

![arch-light](../../assets/arch-light.png#only-light)
![arch-dark](../../assets/arch-dark.png#only-dark)

## Client

The client performs two main tasks:

+ **Verifying that the server it communicates with is the expected hardened AI server** using attestation.
+ **Securely sending data** to be analyzed by a remote AI model using attested TLS to ensure data is not exposed.

## Server

The server is split into three components:

+ The **hardened AI container**: This element serves our AI API in an isolated [hardened environment](../concepts/enclaves.md).
+ The **attesting launcher**: The launcher loads the hardened AI container and creates a proof file which is used to verify the API's code and model using [TPM-based attestation](../concepts/TPMs.md). 
+ The **reverse proxy**: The reverse proxy handles communications to and from the client and the container and launcher using [atested TLS](../concepts/attested-tls.md).

![serv-arch-light](../../assets/serv-arch-light.png#only-light)
![serv-arch-dark](../../assets/serv-arch-dark.png#only-dark)