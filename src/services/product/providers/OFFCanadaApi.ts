import { StoreProduct, ProductResponse, ResponseStatus, Product } from "@/src/types/Product";
import { BaseProductApi } from "./BaseProductApi";
import { CanadaOFFApiConfig as configs } from "@/src/Configs";
import { OFFCanadaProduct, OFFCanadaSearchResponse } from "@/src/types/OFFCanadaApi";

export default class OFFCanadaApi extends BaseProductApi {

    protected async get<T>(url: URL): Promise<T | null> {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                return null;
            }

            return response.json() as Promise<T>;
        } catch {
            return null;
        }
    }

    async getProduct(product: StoreProduct): Promise<ProductResponse> {

        const queryParams = {
            product_id: product.productId ?? '',
            code: product.code ?? '',
            name: product.name ?? '',
            brand: product.brand ?? '',
            quantity: product.quantity ?? '',
            search_query: product.searchQuery ?? '',
        };

        const url = new URL(configs.product.lookup.url);
        url.search = new URLSearchParams(queryParams).toString();

        const res = await this.get<OFFCanadaSearchResponse>(url);
        if (res) {
            return this.parseResponse(res);
        }
        
        return {
            status: ResponseStatus.ERROR,
            message: 'Product not found',
            product: null,
        };
    }

    private parseResponse(response: OFFCanadaSearchResponse): ProductResponse {
        if (!response.status || !response.product) {
            return {
                status: ResponseStatus.ERROR,
                message: response.message ?? 'Product not found',
                product: null,
            };
        }

        return {
            status: ResponseStatus.SUCCESS,
            message: response.message,
            product: this.parseProduct(response.product),
        };
    }

    private parseProduct(product: OFFCanadaProduct): Product {
        const novaGroup = parseInt(product.scores?.nova_score, 10);

        return {
            code: product.barcode ?? '',
            name: product.title ?? null,
            brand: product.brand ?? null,
            quantity: product.size ?? null,
            quantityUnit: null,
            imageUrl: product.image_url ?? null,

            nutrients: {
                fat: product.nutrient_levels?.fat?.level ?? 'unknown',
                saturated_fat: product.nutrient_levels?.saturated_fat?.level ?? 'unknown',
                sugar: product.nutrient_levels?.sugars?.level ?? 'unknown',
                salt: product.nutrient_levels?.sodium?.level ?? 'unknown',
            },

            nutriscoreGrade: product.scores?.nutri_score ?? 'unknown',
            novaGroup: Number.isNaN(novaGroup) ? 'unknown' : novaGroup,
            ecoscoreGrade: product.scores?.eco_score ?? 'unknown',

            showSearchWarning: product.match_type !== 'direct',
        };
    }
}