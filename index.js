/**
 * get (store.json)
 * */
$.get("store.json").done((data) => {
  const tempButton = (item) =>
    `<div class="item-wrap" id=${item.id} key=${item.id} draggable="true">
    <img src="img/${item.photo}" />
    <div class="title">${item.title}</div>
    <div class="brand">${item.brand}</div>
    <p class="price">${item.price}</p>
    <button class="add-item">담기</button>
  </div>`;

  const tempInput = (item) =>
    `<div class="item-wrap" key=${item.id}>
    <img src="img/${item.photo}" />
    <div class="title">${item.title}</div>
    <div class="brand">${item.brand}</div>
    <p>${item.price}</p>
    <input class="item-count" type="text" value="1" />
  </div>`;

  data.products.forEach((item) => {
    $(".goods-container").append(tempButton(item));
  });

  /**
   * 검색어 찾기
   */
  $("form").on("submit", function (e) {
    e.preventDefault();
    $(".goods-container").empty();
    const result = $("#search").val();
    const searchItem = data.products.filter((item) =>
      item.title.includes(result)
    );
    searchItem.map((item) => {
      $(".goods-container").append(tempButton(item));
    });
  });

  function drag(e) {
    e.originalEvent.dataTransfer.setData("id", e.target.id);
  }

  /**
   * cart - 버튼 방식
   * */
  $(".add-item").on("click", function () {
    $(".before-text").removeClass("show");

    // 클릭한 상품의 id값 찾기
    const id = $(this).parents().attr("key");

    // 클릭한 상품이 장바구니에 있으면 개수만 증가
    const targetLength = $(`.cart-item .item-wrap[key=${id}]`).length;
    const prevCnt = $(`.cart-item .item-wrap[key=${id}] input`).val();
    if (targetLength) {
      $(`.cart-item .item-wrap[key=${id}] input`).attr("value", +prevCnt + 1);
      priceCalc();
      return;
    }

    // 클릭한 상품 복제
    const newItem = data.products.filter((item) => item.id == id);

    $(".cart-item").append(tempInput(newItem[0]));
    priceCalc();
  });

  /**
   * cart - 드래그 앤 드롭 방식
   */
  // drag
  $(".goods-container .item-wrap").on("dragstart", function (e) {
    e.originalEvent.dataTransfer.setData("id", this.id);
  });

  // drop
  $(".cart-item").on("dragover", function (e) {
    e.preventDefault();
  });
  $(".cart-item").on("drop", function (e) {
    e.preventDefault();
    $(".before-text").removeClass("show");
    const id = e.originalEvent.dataTransfer.getData("id");

    // 드래그한 상품이 장바구니에 있으면 개수만 증가
    const targetLength = $(`.cart-item .item-wrap[key=${id}]`).length;
    const prevCnt = $(`.cart-item .item-wrap[key=${id}] input`).val();
    if (targetLength) {
      $(`.cart-item .item-wrap[key=${id}] input`).attr("value", +prevCnt + 1);
      priceCalc();
      return;
    }

    //처음 등록한 상품인경우 -> 클릭 상품 복제
    const newItem = data.products.filter((item) => item.id == id);

    $(".cart-item").append(tempInput(newItem[0]));
    priceCalc();
  });

  /**
   * 최종가격 추가
   */

  const priceCalc = () => {
    let finalPrice = 0;
    const inputCount = $(".item-count");

    for (let i = 0; i < $(".item-count").length; i++) {
      let price = inputCount.eq(i).siblings("p").text();
      console.log("price:", price);
      let cnt = inputCount.eq(i).val();
      finalPrice += parseFloat(price * cnt);
      console.log(finalPrice);
    }
    $(".total-price").html(finalPrice);

    // input값 변경 시에도 최종가격 변경
    inputCount.on("input", function () {
      priceCalc();
    });
  };
});
