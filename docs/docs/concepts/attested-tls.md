# Attested TLS
________________________________________________________

## What is attested TLS?

Attested TLS combines the security of data in transit with [TLS](https://hpbn.co/transport-layer-security-tls/) with a proof of the identity of the server, which in our case is part of a verified hardened system.	

In comparison, regular TLS only prevents outside parties from knowing users’ information when it is transit to the AI provider. It does not protect data from the AI provider itself on arrival at the endpoint.

Attested TLS is often deployed in the context of [Confidential Computing](https://www.fortanix.com/platform/confidential-computing-manager/what-is-confidential-computing) where a secure TLS connection is directs communications to within an attested isolated environment, or [Trusted Execution Environments](https://www.techtarget.com/searchitoperations/definition/trusted-execution-environment-TEE), which cannot be accessed or interfered with from the outside.

By binding a TLS certificate to an attested secure environment we protect ourselves against man-in-the-middle (MITM) attacks, as we have proof that we are communicating with our attested secure environment and not one that is merely forwarding a quote from a valid machine.

## How does attested TLS work in BlindLlama?

![aTLS-light-mode](../../assets/aTLS-light.png#only-light)
![aTLS-dark-mode](../../assets/aTLS-dark.png#only-dark)

Let's take a look at how we attested TLS works in BlindLlama step-by-step:

### Server side

1. We deploy the BlindLlama server on Mithril Cloud
2. On deployment, the server creates a tls-terminating reverse proxy. The reverse proxy provider takes care of generating the TLS certificate required for secure communications. Since this is done within our hardened isolated environment, it remains protected and is not accessible even to our admins. The client will communicate with this reverse proxy server, which will relay the inbound/outbound communications to the BlindLlama server.
3. The TLS certificate is hashed by the BlindLlama server and stored in the TPM platform register PCR15. For more details about TPMs and PCRs, see our guide on [TPMs](./TPMs.md).
4. The TLS certificate is hashed and included in the TPM's quote, which is then shared with clients when they connect with the server for verification.

![tls-hash-light](../../assets/TLS-hash-light.png#only-light)
![tls-hash-dark](../../assets/TLS-hash-dark.png#only-dark)


### Client side

When the end user connects to the BlindLlama server, the client will receive BlindLlama's proof file, which contains:

  + The server's TLS certificate from the connection
  + The TPM's quote
  + A certificate chain used to verify the TPM quote's signature

This TLS certificate for the current session is checked against the expected TLS certificate hash value in the TPM's quote.

If they do not match, the connection will fail and an error is raised.

This prevents man-in-the-middle attacks. 

If we did not implement attested TLS, a malicious server could intercept and forward an authentic and valid BlindLlama proof file which would be accepted by the client.

By checking the identity of the server we are communicating with, the client knows if the server we are communicating with does not have the expected TLS certificate hash and can cut all communications with this server.

![matching-light](../../assets/matching-light.png#only-light)
![matching-dark](../../assets/matching-dark.png#only-dark)

As detailed [in the previous section](./TPMs.md), the TPM's quote also contains hashes relating to the stack of the machine the server is deployed on, the inference server's code and the model's weights. This means not only are we sure we are connecting to the correct server using TLS but we know that this server is serving the expected code and model!

<div style="text-align: left;">
  <a href="../TPMs" class="btn">Back</a>
</div>

<div style="text-align: right;">
  <a href="https://blindllama.mithrilsecurity.io/en/latest/" class="btn">Home</a>
</div>