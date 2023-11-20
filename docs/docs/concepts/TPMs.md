---
description: "Explore TPMs in BlindLlama: Understand their role in data security, cryptographic capabilities, and secure storage."
---

# Trusted Platform Modules (TPMs)
________________________________________________________

### What is a TPM?

TPMs are secure hardware components (usually in the form of a small chip), with built-in cryptographic capabilities and secure storage in the form of Platform Configuration Registers (PCRs). They are generally used to protect secrets such as encryption keys with enhanced security since they cannot be directly accessed or tampered with by the OS. 

In our case, we make use of the TPMs to ensure the integrity of a whole software stack by measuring each component, from the UEFI to the OS, which can then be verified (or **attested**).

In addition, we also use TPMs to measure and attest additional data such as the server code and model weights.

The enhanced security and platform integrity of TPMs is leveraged and offered by all the major Cloud providers in the form of vTPMs, or virtual TPMS. Azure leverages TPMs in their [Trusted Launch](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) offer, AWS with [NitroTPM & Secure Boot](https://aws.amazon.com/blogs/aws/amazon-ec2-now-supports-nitrotpm-and-uefi-secure-boot/) and Google Cloud with vTPM-compatibility provided across their [VMware Engine](https://cloud.google.com/vmware-engine/docs/vmware-ecosystem/howto-vtpm).

A virtual Trusted Platform Module (vTPM) is a software-based implementation of a physical Trusted Platform Module (TPM) chip which provides all the same functions as the physical chip. The hypervisor creates a secure and isolated region of memory which replicates the isolation of a physical TPM.

![tpm-vs-vtpm-light](../../assets/tpm-vs-vtpm-light.png#only-light)
![tpm-vs-vtpm-dark](../../assets/tpm-vs-vtpm-dark.png#only-dark)


## How do we use TPMs in BlindLlama?

BlindLlama achieves confidentiality of data by first hardening our AI server, i.e. having it reviewed to ensure it is not leaking data, and then proving such a hardened server is actually used by verifying the expected server is loaded. 

### Server side

#### Measuring the software stack

When the TPM-enabled machine used for server deployment is booted, various default measurements are taken, such as hashes of firmware, boot loaders, and critical system files. These hashes are stored in the TPM's PCRs (Platform Configuration Registers), a set of registers, or locations in memory, within the TPM itself.

![PCR-alloc-dark](../../assets/PCR-alloc-dark.png#only-dark)
![PCR-alloc-light](../../assets/pcr-alloc-light.png#only-light)

The BlindLlama server then additionally stores hashes of the following elements in PCRs:

+ The **BlindLlama** inference server code
+ The **model weights** we serve
+ The **TLS certificate** used for secure communications

![PCR-alloc-extra-dark](../../assets/PCR-alloc-extra-dark.png#only-dark)
![PCR-alloc-extra-light](../../assets/pcr-alloc-extra-light.png#only-light)

#### Collecting PCR values

The BlindLlama server then requests a signed quote from the TPM which contains these PCR values and is signed by the TPM's Attestation Key (AK). The AK never leaves the TPM and therefore cannot be accessed, even by our admins.

![tpm-quote-dark](../../assets/tpm-quote-dark.png#only-dark)
![tpm-quote-light](../../assets/tpm-quote-light.png#only-light)

#### Creating proof file

The BlindLlama server includes this TPM's quote in a cryptographic proof file, which also contains a certificate chain used to verify the TPM quote's signature and the server's TLS certificate.

![proof-dark](../../assets/proof-dark.png#only-dark)
![proof-light](../../assets/proof-light.png#only-light)

### Client side: verifying the proof file

When an end user queries our BlindLlama API, before a secure connection can be established with the server, the client will receive and verify the server's **cryptographic proof file**, which contains **the TPM's quote** signed by the private AK. 

The client also receives a [cert chain](https://www.ibm.com/docs/en/ztpf/1.1.0.15?topic=ca-certificate-chain-verification), a chain of certificates, which is used to verify the TPM quote’s signature.

Verification is done in done in three steps:

#### 1. Verifying the Attestation Key

The client validates the AK using the certificate chain. This certificate chain is issued by the Cloud provider and is evidence that the key really is the Attestation Key of one of their TPMs.

![chain-dark](../../assets/chain-dark.png#only-dark)
![chain-light](../../assets/chain-light.png#only-light)

!!! warning 
    There is currently no signed endorsement from Azure for the TPM’s attestation key. We are currently working on resolving this issue. 

#### 2. Verifying the TPM quote

Now we have validated the AK, we use the public part of this key to check the TPM's quote's signature. This allows us to have confidence in the authenticity of the TPM quote contained within our proof file.

#### 3. Verifying the hashed values

Once we have established that the TPM quote is authentic, the client recreates the quote's hash values and verifies that they match the values in quote. If any of these hashes do not match with the quote's corresponding hash, an error will be raised!

![hash-check-dark](../../assets/hash-check-dark.png#only-dark)
![hash-check-light](../../assets/hash-check-light.png#only-light)

??? example "Understanding PCR measurements"

    PCR values can either be fixed, and will never change, or changeable.

    For fixed PCR values, every detail of what gets measured is known in advance. Therefore, it's possible to pre-compute the expected value. 

    Such PCR registers typically measure components that don't change across boots, such as firmware. 

    To check them, we compare their values against the expected measurement (called a golden measurement). 

    This is straightforward but rigid. The measured component can't be changed without also changing the golden measurement. So, if the PCR value matches the golden measurement, it means that the component is as expected and has not been tampered with. 

    On the other hand, some PCRs relate to data that can change, such as configuration files. 

    These registers are checked with the help of an event log, which records all events relevant to a particular PCR which can then be used by the verifier to recreate the same hash value. This approach is used for the application layer of BlindLlama.


<div style="text-align: left;">
  <a href="../TCB" class="btn">Back</a>
</div>

<div style="text-align: right;">
  <a href="../attested-tls" class="btn">Next</a>
</div>
