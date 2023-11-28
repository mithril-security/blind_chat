# Attested TLS
________________________________________________________

## What is attested TLS?

While [attestation](./attestation.md) provides the client with proof that an enclave server is genuine and loaded with the expected code, the client also needs to make sure that this proof originates from the server they are communicating with and that they have not merely been forwarded genuine proofs from a malicious man-in-the-middle server.

This can do done through a process called attested TLS, which allows the client to check the ID of the server before established secure and attested communications with it. This is done by including the TLS certificate in the attestation process, effectively binding the TLS certificate to the enclave.

By doing this, APIs deployed with BlindLlama are protected against man-in-the-middle (MITM) attacks, since we have proof that we are communicating with the expected enclave.

## How does attested TLS work in BlindLlama?

![aTLS-light-mode](../../assets/aTLS-light.png#only-light)
![aTLS-dark-mode](../../assets/aTLS-dark.png#only-dark)

Let's take a look at how we attested TLS works in BlindLlama step-by-step:

### Server side

On deploying BlindLlama, the enclave's TLS certificate is hashed by the and stored in a TPM platform register.

When a client initiates the attestation process, this hashed TLS certificate value is included in the TPM's quote. Once this value has been verified, it acts as an ID for the enclave.

![tls-hash-light](../../assets/TLS-hash-light.png#only-light)
![tls-hash-dark](../../assets/TLS-hash-dark.png#only-dark)

### Client side

When the attestation process is triggered and the client receives the signed TPM quote including this hash of the enclave's TLS certificate, as well as the TLS certificate itself which will then be used for all further communications.

The client will then:
 
- verify the TPM's quote, meaning the TLS certificate hash (aka. our enclave's ID) is checked against an expected value
- verify that this hash cooresponds to the TLS certificate provided for all further communications

If either of these verifications complete unsuccesfully, the ID check fails and the client cuts all communications with this server, meaning users cannot send any of their sensitive data to the service.

![matching-light](../../assets/matching-light.png#only-light)
![matching-dark](../../assets/matching-dark.png#only-dark)

### Summary

If we put together the key concepts we have seen in our concepts guide, we now have a solution that offers:

- confidentiality through the isolation of our [enclave](./enclaves.md)
- code integrity through the [attestation process](./attestation.md)
- guarantees we are communicating with the correct server

This makes for a powerful combination that can be used to secure applications.

<div style="text-align: left;">
  <a href="../TPMs" class="btn">Back</a>
</div>

<div style="text-align: right;">
  <a href="https://blindllama.mithrilsecurity.io/en/latest/" class="btn">Home</a>
</div>