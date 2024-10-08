// client/src/stores/owner.ts
import { defineStore } from 'pinia';
import { useApi } from "../composables/useApi.js"

// Define the type for an Owner
export interface Owner {
	id: string,
	name: string,
	entity_type: 'Company' | 'Individual' | 'Investor' | 'Trust',
	owner_type: 'Competitor' | 'Seller' | 'Investor' | 'Professional',
	address: string,
	total_land_holdings: number
}

export interface State {
	owners: Owner[];
}

export interface OwnerData {
	id?: string | null, // Make id optional because it won't be present when creating a new owner
	name: string,
	entity_type: 'Company' | 'Individual' | 'Investor' | 'Trust',
	owner_type: 'Competitor' | 'Seller' | 'Investor' | 'Professional',
	address: string,
	total_land_holdings: number
}


export const useOwnerStore = defineStore('owner', {
	// Used to store Data
	state: (): State => {
		return {
			// Using this interface as a model for owner state
			owners: [],
		};
	},

	// Used to format state data
	getters: {
		ownerDetail: (state: State) => state.owners, // For returning owner data
	},

	// Used to modify data inside the state
	actions: {
		// Run refresh and get user data
		async attempt() {
			try {
				await this.getOwners()
			} catch (error) {
				return
			}
			return
		},

		async createOwner(payload: OwnerData) {
			try {
				const { data } = await useApi().post('/api/owners/createOwner', payload);
				return data;
			} catch (error: Error | any) {
				console.error('Error during Owner creation:', error);
			}
		},
		async getOwners() {
			try {
				const { data } = await useApi().get<Owner[]>(`/api/owners/getOwners`);
				this.owners = data;
				return data;
			} catch (error: Error | any) {
				console.error('Error fetching Owners:', error);
			}
		},
		async updateOwner(payload: OwnerData) {
			try {
				const { data } = await useApi().put(`/api/owners/updateOwner/${payload.id}`, payload);
				return data;
			} catch (error: Error | any) {
				console.error('Error during Owner update:', error);
			}
		},
		async deleteOwner(ownerId: string) {
			try {
				const { data } = await useApi().delete(`/api/owners/deleteOwner/${ownerId}`);
				this.owners = this.owners.filter(owner => owner.id !== ownerId);
				return data;
			} catch (error: Error | any) {
				console.error('Error deleting Owner:', error);
			}
		},
	}
});
