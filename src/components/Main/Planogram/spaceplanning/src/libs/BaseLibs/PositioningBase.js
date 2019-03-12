class PositioningBase {
  constructor() {

  }

  /**
   * Get the transformed point from where the mouse is on the stage
   * @param {The stage} stage 
   */
  GetTransformedMousePoint(stage) {
    let transform = stage.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();
    // now we find relative point
    let pos = stage.getPointerPosition();
    let dropPos = transform.point(pos);

    return dropPos;
  }

  /**
   * Get the transformed point from an objecs position
   * @param {The stage} stage 
   * @param {The object that contains a konva.position()} object 
   */
  GetTransformedObjectPoint(stage, object) {
    let transform = stage.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();
    // now we find relative point
    let pos = object.position();
    let dropPos = transform.point(pos);

    return dropPos;
  }

  //#region Gondola Positioning

  GetNextGondolaPosition(stage) {
    return new Promise(function (resolve) {
      var existingPromises = [];

      let existing = stage.find('.gondola_group');
      existing.forEach(gondola => {
        existingPromises.push(doSingle(gondola));
      });

      function doSingle(gondola) {
        return new Promise(function (resolve) {
          resolve(gondola.getWidth() + 2)
        });
      }

      Promise.all(existingPromises)
        .then(results => {
          var x = 0;
          for (var i = 0; i < results.length; i++) {
            x += results[i];
          }
          resolve(x);
        })
    })
  }
  //#endregion

  //#region Fixture Positioning

  /**
   * To return the even margin for a spaced even fixture
   * @param {The fixture} fixture 
   */
  GetSpaceEvenMargin(fixture) {
    let self = this;

    // TODO: Calculate the below
    // get all the fixtures children
    // add all the widths together
    // subtract the widths from the fixture width
    // divide the difference by the number of children.

  }

  /**
   * Sets the product groups and sub fixtures in the correct order based on the position number
   * @param {The fixture item with all products and sub fixtures} fixture 
   */
  Calculate_AllProductAndSubfixturePositions(fixture) {
    let self = this;
    let posArr = self.GetFixtureSubFixtureGroupPositionArray(fixture);

    let previousItem = null;
    let groupX = fixture.Group.getX()
    let x = 0;
    let y = 0;
    console.log("[FIXTURE] Calculate subdixture & Product positions --> PosArr", posArr);

    posArr.forEach(element => {

      console.log("[FIXTURE] Calculate subdixture & Product positions --> Constructor Name", element.constructor.name);

      //#region Position each child ROOT group
      switch (fixture.Type.toUpperCase()) {
        case "SHELF":
          {
            console.log("[POSITIONING] ALL CHILDREN IN " + fixture.Type.toUpperCase());
            if (previousItem == null) {
              if (element.constructor.name == "ProductGroup") {
                x = groupX;
                y = fixture.ClientRect.getY()

              } else if (element.constructor.name == "Basket") {
                x = groupX;
                y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

              }
            } else {

              if (element.constructor.name == "ProductGroup") {

                if (previousItem.constructor.name == "ProductGroup") {
                  x = (previousItem.Group.getX() + previousItem.TotalWidth);
                  y = fixture.ClientRect.getY()

                } else if (previousItem.constructor.name == "Basket") {
                  x = (previousItem.Group.getX() + previousItem.Group.getWidth());
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (previousItem.FixtureData.height * element.Ratio))

                }

              } else if (element.constructor.name == "Basket") {

                if (previousItem.constructor.name == "ProductGroup") {
                  x = (previousItem.Group.getX() + previousItem.TotalWidth);
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

                } else if (previousItem.constructor.name == "Basket") {
                  x = (previousItem.Group.getX() + previousItem.Group.getWidth());
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

                }
              }
            }

            if (element.constructor.name == "ProductGroup") {
              element.Group.position({
                x: x,
                y: y
              });
            } else if (element.constructor.name == "Basket") {
              element.Group.position({
                x: x,
                y: y
              });

              element.ClientRect.destroy();
              element.ClientRect = null;
              element.AddClientRect();
            }
          }
          break;
        case "BASE":
          {
            console.log("[POSITIONING] ALL CHILDREN IN " + fixture.Type.toUpperCase());
            if (previousItem == null) {
              if (element.constructor.name == "ProductGroup") {
                x = groupX;
                y = fixture.ClientRect.getY()

              } else if (element.constructor.name == "Basket") {
                x = groupX;
                y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

              }
            } else {

              if (element.constructor.name == "ProductGroup") {

                if (previousItem.constructor.name == "ProductGroup") {
                  x = (previousItem.Group.getX() + previousItem.TotalWidth);
                  y = fixture.ClientRect.getY()

                } else if (previousItem.constructor.name == "Basket") {
                  x = (previousItem.Group.getX() + previousItem.Group.getWidth());
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (previousItem.FixtureData.height * element.Ratio))

                }

              } else if (element.constructor.name == "Basket") {

                if (previousItem.constructor.name == "ProductGroup") {
                  x = (previousItem.Group.getX() + previousItem.TotalWidth);
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

                } else if (previousItem.constructor.name == "Basket") {
                  x = (previousItem.Group.getX() + previousItem.Group.getWidth());
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

                }
              }
            }

            if (element.constructor.name == "ProductGroup") {
              element.Group.position({
                x: x,
                y: y
              });
            } else if (element.constructor.name == "Basket") {
              element.Group.position({
                x: x,
                y: y
              });

              element.ClientRect.destroy();
              element.ClientRect = null;
              element.AddClientRect();
            }
          }
          break;
        case "PEGBAR":
          {
            console.log("[POSITIONING] ALL CHILDREN IN " + fixture.Type.toUpperCase());

            if (previousItem == null) {
              if (element.constructor.name == "ProductGroup") {
                x = groupX;
                y = fixture.ClientRect.getY()

              } else if (element.constructor.name == "Basket") {
                x = groupX;
                y = fixture.ClientRect.getY()

              }
            } else {

              if (element.constructor.name == "ProductGroup") {

                if (previousItem.constructor.name == "ProductGroup") {
                  x = (previousItem.Group.getX() + previousItem.TotalWidth);
                  y = fixture.ClientRect.getY()

                } else if (previousItem.constructor.name == "Basket") {
                  x = (previousItem.Group.getX() + previousItem.Group.getWidth());
                  y = fixture.ClientRect.getY()

                }

              } else if (element.constructor.name == "Basket") {

                if (previousItem.constructor.name == "ProductGroup") {
                  x = (previousItem.Group.getX() + previousItem.TotalWidth);
                  y = fixture.ClientRect.getY()

                } else if (previousItem.constructor.name == "Basket") {
                  x = (previousItem.Group.getX() + previousItem.Group.getWidth());
                  y = fixture.ClientRect.getY()

                }
              }
            }

            if (element.constructor.name == "ProductGroup") {
              element.Group.position({
                x: x,
                y: y
              });
            } else if (element.constructor.name == "Basket") {
              element.Group.position({
                x: x,
                y: y
              });

              element.ClientRect.destroy();
              element.ClientRect = null;
              element.AddClientRect();
            }
          }
          break;
        case "BASKET":
          {
            console.log("[POSITIONING] ALL CHILDREN IN " + fixture.Type.toUpperCase());

            if (previousItem == null) {
              if (element.constructor.name == "ProductGroup") {
                x = groupX;
                y = fixture.ClientRect.getY()

              } else if (element.constructor.name == "Basket") {
                x = groupX;
                y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

              }
            } else {

              if (element.constructor.name == "ProductGroup") {

                if (previousItem.constructor.name == "ProductGroup") {
                  x = (previousItem.Group.getX() + previousItem.TotalWidth);
                  y = fixture.ClientRect.getY()

                } else if (previousItem.constructor.name == "Basket") {
                  x = (previousItem.Group.getX() + previousItem.Group.getWidth());
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (previousItem.FixtureData.height * element.Ratio))

                }

              } else if (element.constructor.name == "Basket") {

                if (previousItem.constructor.name == "ProductGroup") {
                  x = (previousItem.Group.getX() + previousItem.TotalWidth);
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

                } else if (previousItem.constructor.name == "Basket") {
                  x = (previousItem.Group.getX() + previousItem.Group.getWidth());
                  y = fixture.ClientRect.getY() + (fixture.ClientRect.getHeight() - (element.FixtureData.height * element.Ratio))

                }
              }
            }

            if (element.constructor.name == "ProductGroup") {
              element.Group.position({
                x: x,
                y: y
              });
            } else if (element.constructor.name == "Basket") {
              element.Group.position({
                x: x,
                y: y
              });
            }
          }
          break;
      }
      //#endregion

      // if (element.constructor.name == "ProductGroup") {
      //   element.AddProductDisplay(element.Orientation_Width, element.Orientation_Height);
      // } else if (element.constructor.name == "Basket") {
      //   let x = element.Group.getX();
      //   let prevItem = null;
      //   element.ProductGroupArray.sort((a, b) => a.Position - b.Position).forEach(productGroup => {

      //     if (prevItem == null) {
      //       productGroup.Group.setX(x);
      //     } else {
      //       x += prevItem.TotalWidth;
      //     }
      //     prevItem = productGroup;
      //     productGroup.AddProductDisplay(productGroup.Orientation_Width, productGroup.Orientation_Height);
      //   });
      // }

      previousItem = element;
    });

    fixture.Stage.draw();
  }

  /**
   * Sets the Fixture children position numbers so that they are ordered correctly.
   * @param {The fixture that contains all the children} fixture 
   */
  SetFixtureChildrenPositionNumbers(fixture) {
    let posArr = [];

    fixture.ProductGroupArray.forEach(product => {
      posArr.push({
        y: product.Group.getY(),
        x: product.Group.getX(),
        objectItem: product
      })
    });

    fixture.SubFixtures.forEach(subFixture => {
      posArr.push({
        y: subFixture.Group.getY(),
        x: subFixture.Group.getX(),
        objectItem: subFixture
      })
    });

    switch (fixture.Type.toUpperCase()) {
      case "SHELF":
        {
          posArr.sort((a, b) => a.x - b.x);
        }
        break;
      case "BASE":
        {
          posArr.sort((a, b) => a.x - b.x);
        }
        break;
      case "PEGBAR":
        {
          posArr.sort((a, b) => a.x - b.x);
        }
        break;
      case "PEGBOARD":
        {
          posArr.sort((a, b) => a.x - b.x && a.y - b.y);
        }
        break;
    }

    posArr.forEach((element, idx) => {
      element.objectItem.Position = idx + 1;
      console.log("[POSITION NUMBER]", element.objectItem, element.objectItem.Position)
    });
  }

  /**
   * Return the next X position of a newwly placed child for a fixture
   * @param {The fixture} fixture 
   */
  GetFixtureChildNextPlacementPositionX(fixture) {
    let self = this;

    let posArr = self.GetFixtureSubFixtureGroupPositionArray();

    posArr.forEach(element => {

    });
    let x = fixture.Group.getX();
    if (element.constructor.name == "ProductGroup") {
      x += (element.Group.getX() + element.TotalWidth);
    } else if (element.constructor.name == "Basket") {
      x += (element.Group.getX() + element.Group.getWidth());
    }

    return x;
  }

  /**
   * Return the child item within a fixture by position number
   * @param {The fixture} fixture 
   * @param {The position requested} position 
   */
  GetChildAtPositionNumber(fixture, position) {
    let self = this;
    let posArr = self.GetFixtureSubFixtureGroupPositionArray(fixture);
    let found = posArr.filter((el) => el.Position == position);
    if (found != undefined && found.length > 0) {
      return found[0];
    } else {
      return null;
    }
  }

  //#endregion

  //#region Product positioning
  // The physical products withing a product group.
  /**
   * Will return the position of a product rect within a product group based on the facings sent in
   * @param {The y facings count} yCount 
   * @param {The x facings count} xCount 
   * @param {the stage} stage 
   * @param {The parent fixture for this product group} fixtureItem 
   * @param {The product group in question} productGroup 
   */
  ProductPosition(yCount, xCount, stage, fixtureItem, productGroup) {
    let self = this;

    var retVal = {
      x: 0,
      y: 0
    };

    console.log("[PRODUCT POSITIONING] Positioning for : ", productGroup.FixtureType.toUpperCase());

    switch (productGroup.FixtureType.toUpperCase()) {
      case "SHELF":
        {
          if (productGroup.FixtureID == null) {
            return retVal;
          } else {
            retVal.y = fixtureItem.ClientRect.getHeight() - ((yCount + 1) * productGroup.Orientation_Height);
            retVal.x = (xCount * productGroup.Orientation_Width);
            return retVal;
          }

        }
        break;
      case "BASE":
        {
          if (productGroup.FixtureID == null) {
            return retVal;
          } else {
            retVal.y = fixtureItem.ClientRect.getHeight() - ((yCount + 1) * productGroup.Orientation_Height);
            retVal.x = (xCount * productGroup.Orientation_Width);
            return retVal;
          }

        }
        break;
      case "PEGBAR":
        {
          if (productGroup.FixtureID == null) {
            return retVal;
          } else {
            retVal.y = (fixtureItem.ClientRect.getHeight() / 2);
            retVal.x = (xCount * productGroup.Orientation_Width);
            return retVal;
          }
        }
        break;
      case "BASKET":
        {
          if (productGroup.FixtureID == null) {
            return retVal;
          } else {
            console.log("[BASKET PRODUCT POSITIONS]", fixtureItem)
            retVal.y = fixtureItem.ClientRect.getHeight() - ((yCount + 1) * productGroup.Orientation_Height);
            retVal.x = (xCount * productGroup.Orientation_Width);
            return retVal;
          }
        }
        break;
      case "PEGBOARD":
        {
          if (productGroup.FixtureID == null) {
            return retVal;
          } else {

            if (productGroup.PegboardHoleAssigned == null) {
              if (productGroup.PegboardHoleAssignedID == null) {
                console.error("Cannot find peg assigned because id and peg is null for this product.");
              } else {
                productGroup.PegboardHoleAssigned = productGroup.Stage.find('#' + productGroup.PegboardHoleAssignedID);
                console.log("TRYING TO FIND PEG HOLE", productGroup.PegboardHoleAssignedID, productGroup.Stage.find('#' + productGroup.PegboardHoleAssignedID))
              }
            }

            let holePos = self.TransformMousePoint(stage);

            // determine where the hole is and position the group to that
            productGroup.Group.position({
              // x: self.PegboardHoleAssigned.getAbsolutePosition().x - (self.Orientation_Width / 2),
              // y: self.PegboardHoleAssigned.getAbsolutePosition().y

              x: (holePos.x + (productGroup.PegboardHoleAssigned.getWidth() / 2)) - (productGroup.Orientation_Width / 2),
              y: holePos.y + (productGroup.PegboardHoleAssigned.getHeight() / 2)
            })

            // return product position relative to the ProductGroup
            retVal.y = (yCount * productGroup.Orientation_Height);
            retVal.x = (xCount * productGroup.Orientation_Width);
            return retVal;
          }
        }
        break;
    }
  }

  //#endregion

  //#region Array functions

  /**
   * Return the position array of all children within a fixture
   * @param {The fixture item} fixture 
   */
  GetFixtureSubFixtureGroupPositionArray(fixture) {
    let posArr = fixture.ProductGroupArray;
    posArr = posArr.concat(fixture.SubFixtures)
    posArr.sort((a, b) => a.Position - b.Position);
    return posArr;
  }

  /**
   * Return the last position used within a fixture
   * @param {The fixture item} fixture 
   */
  GetLastPositionNumber(fixture) {
    let self = this;

    let posArr = self.GetFixtureSubFixtureGroupPositionArray(fixture);
    let lastIndex = 0;
    if (posArr.length > 0) {
      lastIndex = posArr.length - 1;
    } else {
      return 1; // default return 1, the fixture has no children with position numbers
    }
    return posArr[lastIndex];
  }

  //#endregion Array functions
}

export default PositioningBase;