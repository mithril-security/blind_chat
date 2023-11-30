# Enclaves
________________________________________________________

## What are enclaves?

Enclaves are secure and verifiable computing environments designed to protect data in use.

They have two key properties:

- **Confidentiality**: Data analyzed in an enclave is not exposed even to the party that manages the enclave thanks to isolation and encryption. 
- **Code integrity**: Enclaves can provide verifiable cryptographic guarantees that they are correctly configured and contain the expected code. 

![enclave](../../assets/enclaves.png#only-dark)
![enclaves](../../assets/enclaves-light.png#only-light)

Users’ data sent to an enclave application is encrypted and is only decrypted and analyzed inside of the enclave, which is isolated from the rest of the system. 

While the type of encryption can vary depending on the enclave provider, the keys are created in protected memory, often inside of the enclave itself, so no one can access the encryption key.

### Enclaves providers

There are various different enclaves, which come with different trade-offs and implementations, but all of them provide confidentiality for data in use and a way to verify the enclave.

The table below gives a quick overview of some available enclave solutions today.

![enclaves-table](../../assets/enclaves-table.jpg#only-dark)
![enclaves-table](../../assets/enclaves-table-light.jpg#only-light)

Let's now find out more about the enclaves leveraged in BlindLlama

## How we use enclaves in BlindLlama

Due to their lack of compatibility with GPU, which is a must for LLM inference tasks, we did not create BlindLLama around an existing solution, but rather we created our own type of enclaves using virtual Trusted Platform Modules (TPMs). 

> TPMs are a tried and tested technology that can be used to measure, store and verify the whole software stack of a machine.

![our-enclaves](../../assets/our-enclaves.png#only-dark)
![our-enclaves](../../assets/our-enclaves-light.png#only-light)

Our enclaves **ensure confidentiality** through the deployment of a container with strict isolation policies, as well as a custom minimal OS, loaded in RAM to mitigate attacks on disk. 

We ensure code integrity through **TPM-based attestation**, which verifies the customs OS, application and TLS certificate of our enclave.


<div style="text-align: left;">
  <a href="../overview" class="btn">Back</a>
</div>

<div style="text-align: right;">
  <a href="../TCB" class="btn">Next</a>
</div>