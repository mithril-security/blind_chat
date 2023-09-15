import {
	HF_ACCESS_TOKEN,
	HF_API_ROOT,
	USE_CLIENT_CERTIFICATE,
	CERT_PATH,
	KEY_PATH,
	CA_PATH,
	CLIENT_KEY_PASSWORD,
	REJECT_UNAUTHORIZED,
} from "$env/static/private";
import { sum } from "$lib/utils/sum";
import type { BackendModel, Endpoint } from "./models";

import { loadClientCertificates } from "$lib/utils/loadClientCerts";

if (USE_CLIENT_CERTIFICATE === "true") {
	loadClientCertificates(
		CERT_PATH,
		KEY_PATH,
		CA_PATH,
		CLIENT_KEY_PASSWORD,
		REJECT_UNAUTHORIZED === "true"
	);
}

/**
 * Find a random load-balanced endpoint
 */
export function modelEndpoint(model: BackendModel): Endpoint {
	if (model.is_local ?? false) {
		return {
			host: "local",
			model: model.name,
			weight: 1,
			url: `${HF_API_ROOT}/${model.name}`,
			authorization: `Bearer ${HF_ACCESS_TOKEN}`,
		};
	} else if (!model.endpoints) {
		return {
			host: "tgi",
			url: `${HF_API_ROOT}/${model.name}`,
			authorization: `Bearer ${HF_ACCESS_TOKEN}`,
			weight: 1,
		};
	}
	const endpoints = model.endpoints;
	const totalWeight = sum(endpoints.map((e) => e.weight));

	let random = Math.random() * totalWeight;
	for (const endpoint of endpoints) {
		if (random < endpoint.weight) {
			console.log(endpoint);
			return endpoint;
		}
		random -= endpoint.weight;
	}

	throw new Error("Invalid config, no endpoint found");
}
