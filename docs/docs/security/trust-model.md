# Trust model
________________________________________________________

On this page, we will explain more precisely which parties have to be trusted when using BlindLLama APIs such as BlindChat.

To understand better which components and parties are trusted with BlindLlama, let’s start by examining who or what is trusted with regular AI services.

## Trusted Parties with regular AI providers

In the case of an AI provider serving an AI API to end users on a Cloud infrastructure, the parties to be trusted are:

+ **The AI provider**: they provide the software application that is in charge of applying AI models to users’ data. Examples of AI providers in the industry include Hugging Face, OpenAI, Cohere, etc.

+ **The Cloud provider**: they provide the infrastructure, Hypervisor, VMs and OS, to the AI provider. Examples of Cloud providers in the industry include Azure, GCP, AWS, etc. 

+ **The hardware providers**: they provide the physical components, CPU, GPU, TPMs, etc. to the Cloud provider. Examples of hardware provders in the industry include Intel, AMD, Nvidia, etc. 

The higher the party in the stack, the closer they are to the data. Thus, the AI provider if malicious or negligent represents the biggest security risk for the user of the API.

In most scenarios today, there is often blind trust in the AI provider, aka **we send data to them without any technical guarantees regarding how they will handle or use our data**. For instance, the AI provider could say they just do inference on data, while they could actually train models on users’ data. And even if most AI providers are honest, there is no way to know if their security practices are strong enough to protect your data.

For privacy-demanding users that require more technical guarantees, they often choose simply not to use AI APIs as they cannot trust AI providers with their confidential data.

## Trusted parties with BlindLlama

With BlindLlama, we remove the AI provider (Mithril Security) from the list of trusted parties. When models are served with BlindLlama, our admins cannot see user data because we use a Zero-trust AI infrastructure, removing the need for users to blindly trust us. 
	
We can prove such controls are in place using [TPM-based attestation](../concepts/TPMs.md).

![trust-model-light](../../assets/trust-model-light.png#only-light)
![trust-model-dark](../../assets/trust-model-dark.png#only-dark)