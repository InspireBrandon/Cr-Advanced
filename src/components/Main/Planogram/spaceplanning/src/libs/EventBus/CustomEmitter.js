class CustomEmitter {
  constructor() {

  }

  notify_cluster_change(emitter) {
    emitter.$emit('NOTIFY_CLUSTER_CHANGE');
  }

  notify_gondola_selected_deselected(emitter, selected, data) {
    emitter.$emit('NOTIFY_GONDOLA_SELECTED_DESELECTED', {
      selected: selected,
      data: data,
    })
  }

  notify_product_group_selected_deselected(emitter, selected, data) {
    emitter.$emit('NOTIFY_PRODUCT_GROUP_SELECTED_DESELECTED', {
      selected: selected,
      data: data,
    })
  }

  notify_product_group_statistics(emitter, show, data) {
    emitter.$emit('NOTIFY_PRODUCT_GROUP_STATISTICS', {
      data: data,
      show: show
    })
  }

  modal_load(emitter, type, subType, data, id, object) {
    console.log("MODAL OPEN ", type);

    emitter.$emit('MODAL_LOAD', {
      data: data,
      id: id,
      type: type,
      object: object,
      subType: subType
    })
  }

  modal_saved(emitter, type, subType, data, id, object) {
    console.log("MODAL SAVED ", type);

    emitter.$emit('MODAL_SAVED', {
      data: data,
      id: id,
      type: type,
      subType: subType,
      object: object
    })
  }

  delete_gondola(emitter, data, gondola) {
    console.log("DELETE GONDOLA");

    emitter.$emit('DELETE_GONDOLA', {
      data: data,
      gondola: gondola
    })
  }

  delete_fixture(emitter, data, fixture) {
    console.log("DELETE FIXTURE");

    emitter.$emit('DELETE_FIXTURE', {
      data: data,
      fixture: fixture
    })
  }

  show_error_modal(emitter, header, errorMessage) {
    let data = {
      header : header,
      message : errorMessage
    }
    
    emitter.$emit('SHOW_ERROR_MODAL', {
      data: data
    })
  }

  delete_product(emitter, data, product_object) {
    console.log("DELETE PRODUCT");

    emitter.$emit('DELETE_PRODUCT', {
      data: data,
      product_object: product_object
    })
  }
}

export default CustomEmitter;
