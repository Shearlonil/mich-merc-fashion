import numeral from "numeral";

const _cartItemProps = new WeakMap();

export default class CartItem {
  constructor(item) {
    if (item) {
      _cartItemProps.set(this, {
        id: item.id,
        qty: 0,
        title: item.title,
        price: item.price,
        salesPrice:
          item.discount > 0
            ? numeral(item.price)
                .subtract(
                  numeral(item.discount)
                    .divide(100)
                    .multiply(item.price)
                    .value()
                )
                .format("£0,0.00")
            : item.price,
        discount: item.discount,
        ItemImages: item.ItemImages[0],
        Category: item.Category,
      });
    }
  }

  get id() {
    return _cartItemProps.get(this).id;
  }

  set id(id) {
    _cartItemProps.get(this).id = id;
  }

  get qty() {
    return _cartItemProps.get(this).qty;
  }

  set qty(qty) {
    _cartItemProps.get(this).qty = qty;
  }

  get title() {
    return _cartItemProps.get(this).title;
  }

  set title(title) {
    _cartItemProps.get(this).title = title;
  }

  get price() {
    return _cartItemProps.get(this).price;
  }

  set price(price) {
    _cartItemProps.get(this).price = price;
  }

  get salesPrice() {
    return _cartItemProps.get(this).salesPrice;
  }

  set salesPrice(salesPrice) {
    _cartItemProps.get(this).salesPrice = salesPrice;
  }

  get discount() {
    return _cartItemProps.get(this).discount;
  }

  set discount(discount) {
    _cartItemProps.get(this).discount = discount;
  }

  get ItemImages() {
    return _cartItemProps.get(this).ItemImages;
  }

  set ItemImages(ItemImages) {
    _cartItemProps.get(this).ItemImages = ItemImages;
  }

  get Category() {
    return _cartItemProps.get(this).Category;
  }

  set Category(Category) {
    _cartItemProps.get(this).Category = Category;
  }

  toJSON() {
    return {
      id: this.id,
      qty: this.qty,
      title: this.title,
      price: this.price,
      salesPrice: this.salesPrice,
      discount: this.discount,
      ItemImages: this.ItemImages,
      Category: this.Category,
    };
  }
}
