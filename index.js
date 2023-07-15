/**
 * get (store.json)
 * */
$.get("store.json").done((data) => {
  data.products.forEach((item) => {
    const temp = `
      <div class="item-wrap" id=${item.id} key=${item.id} draggable="true">
        <img src="img/${item.photo}" />
        <div class="title">${item.title}</div>
        <div class="brand">${item.brand}</div>
        <div>가격 : ${item.price}</div>
        <button class="add-item">담기</button>
      </div>
    `;
    $(".goods-container").append(temp);
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
      const temp = `
        <div class="item-wrap" id=${item.id} key=${item.id} draggable="true">
          <img src="img/${item.photo}" />
          <div class="title">${item.title}</div>
          <div class="brand">${item.brand}</div>
          <div>가격 : ${item.price}</div>
          <button class="add-item">담기</button>
        </div>
      `;
      $(".goods-container").append(temp);
    });
  });

  function drag(e) {
    e.originalEvent.dataTransfer.setData("id", e.target.id);
  }

  /**
   * cart - 버튼 방식
   * */
  let cnt = 0;
  $(".add-item").on("click", function () {
    console.log("a");
    $(".before-text").removeClass("show");

    // 클릭한 상품의 id값 찾기
    const id = $(this).parents().attr("key");

    // 클릭한 상품이 장바구니에 있으면 개수만 증가
    const targetLength = $(`.cart-item .item-wrap[key=${id}]`).length;
    const preCnt = $(`.cart-item .item-wrap[key=${id}] input`).val();
    if (targetLength) {
      $(`.cart-item .item-wrap[key=${id}] input`).attr("value", +preCnt + 1);
      return;
    }

    // 클릭한 상품 복제
    const newItem = data.products.filter((item) => item.id == id);

    console.log("b");
    cnt = 1;
    const temp = `
        <div class="item-wrap" key=${newItem[0].id}>
          <img src="img/${newItem[0].photo}" />
          <div class="title">${newItem[0].title}</div>
          <div class="brand">${newItem[0].brand}</div>
          <div>가격 : ${newItem[0].price}</div>
          <input type="text" value=${cnt} />
        </div>
      `;
    $(".cart-item").append(temp);
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
    const preCnt = $(`.cart-item .item-wrap[key=${id}] input`).val();
    if (targetLength) {
      $(`.cart-item .item-wrap[key=${id}] input`).attr("value", +preCnt + 1);
      return;
    }

    //처음 등록한 상품인경우 -> 클릭 상품 복제. cnt = 1
    const newItem = data.products.filter((item) => item.id == id);

    cnt = 1;
    const temp = `
        <div class="item-wrap" key=${newItem[0].id}>
          <img src="img/${newItem[0].photo}" />
          <div class="title">${newItem[0].title}</div>
          <div class="brand">${newItem[0].brand}</div>
          <div>가격 : ${newItem[0].price}</div>
          <input type="text" value=${cnt} />
        </div>
      `;
    $(".cart-item").append(temp);
  });
});
