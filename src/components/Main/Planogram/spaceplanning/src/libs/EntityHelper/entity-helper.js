class EntityHelper {
    constructor(VueStore) {
        this.VueStore = VueStore;
    }

    //#region Gondolas
    GetAllGondolas() {
        let self = this;
        return self.VueStore.getters.getAllGondolas;
    }

    GetGondolaByID(id) {
        let self = this;
        return self.VueStore.getters.getGondolaById(id);
    }

    AddGondola(gondola) {
        let self = this;
        self.VueStore.commit('addGondola', gondola);
    }

    AddFixtureToGondola(gondolaID, fixture) {
        let self = this;
        let existing = self.VueStore.getters.getGondolaById(gondolaID);

        if (existing != null) {
            existing.Fixtures.push(fixture); // add the fixture to the gondola collection
            self.VueStore.commit('addFixture', fixture); // add the fixture to the store
        }
    }

    AddSubFixtureToFixture(fixtureID, subFixture) {
        let self = this;
        let existing = self.VueStore.getters.getFixtureById(fixtureID);

        if (existing != null) {
            existing.SubFixtures.push(subFixture); // add the fixture to the gondola collection
            self.VueStore.commit('addFixture', subFixture); // add the fixture to the store
        }
    }

    RemoveFixtureFromGondola(gondolaID, fixture) {
        let self = this;

        //#region Remove from gondola collection
        let gondola = self.VueStore.getters.getGondolaById(gondolaID);
        let found = gondola.Fixtures.find(function (el) {
            return el.ID == fixture.ID;
        })

        var index = gondola.Fixtures.indexOf(found);
        if (index > -1) {
            gondola.Fixtures.splice(index, 1);
            console.info("[ENTITY-HELPER] Fixture removed from gondola");
        } else {
            console.warn("[ENTITY-HELPER] Failed to remove fixture from gondola. NOT FOUND", gondolaID, fixture);
        }
        //#endregion

        //#region Remove from store

        // TODO : REMOVE FIXTURE FROM STORE

        //#endregion
    }
    //#endregion Gondolas

    //#region Fixtures
    GetAllFixtures() {
        let self = this;
        return self.VueStore.getters.getAllFixtures;
    }

    GetFixtureByID(id) {
        let self = this;
        return self.VueStore.getters.getFixtureById(id);
    }

    AddProductGroupToFixture(fixtureID, productGroup) {
        let self = this;
        let existing = self.VueStore.getters.getFixtureById(fixtureID);

        if (existing != null) {
            existing.ProductGroupArray.push(productGroup); // add the product group to the fixture collection
            self.VueStore.commit('addProductGroup', productGroup); // add the product group to the store
        } else {
            console.warn("[ENTITY-HELPER] Failed to find fixture to add product group to", fixtureID, productGroup);
        }
    }

    AddActivePlanogramProduct(productData) {
        let self = this;
        self.VueStore.commit('addActivePlanogramProduct', productData);
    }

    RemoveProductGroupFromFixture(fixtureID, productGroup) {
        let self = this;

        //#region Remove the product group from the fixture collection
        let fixture = self.VueStore.getters.getFixtureById(fixtureID);
        let found = fixture.ProductGroupArray.find(function (el) {
            return el.ID == productGroup.ID;
        })

        var index = fixture.ProductGroupArray.indexOf(found);
        if (index > -1) {
            fixture.ProductGroupArray.splice(index, 1);
        }
        //#endregion

        //#region Remove the product group from the store

        self.VueStore.commit('removeProductGroup', productGroup);

        //#endregion
    }

    RemoveSubFixtureFromFixture(parentFixtureID, subFixture) {
        let self = this;

        //#region Remove the sub fixture from the sub fixture collection
        let fixture = self.VueStore.getters.getFixtureById(parentFixtureID);
        console.log("[DELETE SUBFIXTURE] Parent Fixture found", fixture);
        
        let found = fixture.SubFixtures.find(function (el) {
            return el.ID == subFixture.ID;
        })

        var index = fixture.SubFixtures.indexOf(found);
        console.log("[DELETE SUBFIXTURE] Parent found subfixture index", index);
        console.log("[DELETE SUBFIXTURE] Parent found subfixtures before remove", fixture.SubFixtures);
        if (index > -1) {
            fixture.SubFixtures.splice(index, 1);
        }
        console.log("[DELETE SUBFIXTURE] Parent found subfixtures after remove", fixture.SubFixtures);
        //#endregion

        //#region Remove the sub fixture from the store
        self.VueStore.commit('removeFixture', subFixture);
        //#endregion
    }
    //#endregion Fixtures

    //#region Product Groups

    GetAllProductGroups() {
        let self = this;
        return self.VueStore.getters.getAllFixtures;
    }

    GetProductGroupByID(id) {
        let self = this;
        return self.VueStore.getters.getProductGroupByID(id);
    }

    //#endregion Product Groups

    //#region Product Line Item

    GetAllProducts() {
        let self = this;
        return self.VueStore.getters.getAllProducts;
    }

    GetProductByID(id) {
        let self = this;
        return self.VueStore.getters.getProductByID(id);
    }

    AddProductLineItem(product) {
        let self = this;
        self.VueStore.commit('addToAllProducts', product);
    }

    //#endregion Product Line Item
}

export default EntityHelper;