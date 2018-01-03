function PrioritySort(domElements){
  this.lists = domElements.lists;
}

PrioritySort.prototype.init = function(){
  this.createPriorityLists();
}

PrioritySort.prototype.createPriorityLists = function(){
  this.lists.each(function(index, item){
    var list = new PriorityList($(item));
    list.init();
  });
}

////////////////////////////////////////////////////////////
function PriorityList(list){
  this.list = list;
  // this.showByPriority = true;
  this.initialCount = this.list.data("initial-items-count");
  this.listItems = this.list.find("li");
  this.prioritySorting = true;
  this.ascendingOrder = true;
  this.seeAll = true;
  this.hiddenList = [];
}

PriorityList.prototype.init = function(){
  this.setPriorityOfItems();
  // this.show();
  this.createButton();
  this.header = $("<div></div>").css("padding", "20px");
  this.createButtonsInHeader();

  this.bindClickEvent();
}

PriorityList.prototype.createButtonsInHeader = function(){
  var alphabetButton = $("<input>").attr("type", "button").val("Alphabetic Sort").addClass("button").data("type", "alphabetic")
  var priorityButton = $("<input>").attr("type", "button").val("Priority Sort").addClass("button").data("type", "priority")
  var ascending = $("<input>").attr("type", "button").val("Ascending").addClass("button").data("type", "ascending");
  var descending = $("<input>").attr("type", "button").val("Descending").addClass("button").data("type", "descending");
  this.header.append(alphabetButton, priorityButton, ascending, descending);
  this.list.after(this.header);
  this.bindClickToHeaderButtons();

  priorityButton.trigger("click");
  ascending.trigger("click");
}

PriorityList.prototype.bindClickToHeaderButtons = function(){
  var _this = this;
  var sortBy;
  var sortingOrder;
  this.header.find("input[type='button']").on("click", function(){
  var type = $(this).data("type");
  if(type == "alphabetic" || type == "priority"){
    sortBy = type;
    _this.sortByClicked = $(this);
    _this.highlightSortButton($(this));
  }
  if(type == "ascending" || type == "descending"){
    sortingOrder = type;
    _this.sortOrderClicked = $(this);
    _this.highlightOrderButton($(this));
  }
  _this.show(sortBy, sortingOrder);
  })
}

PriorityList.prototype.highlightSortButton = function(button){
  if(this.prioritySorting){
    button.addClass("highlight-button").prev().removeClass("highlight-button");
    this.prioritySorting = false;
  } else {
    button.addClass("highlight-button").next().removeClass("highlight-button");
    this.prioritySorting = true;
  }
}

PriorityList.prototype.highlightOrderButton = function(button){
  if(this.ascendingOrder){
    button.addClass("highlight-button").next().removeClass("highlight-button");
    this.ascendingOrder = false;
  } else {
    button.addClass("highlight-button").prev().removeClass("highlight-button");
    this.ascendingOrder = true;
  }
}

PriorityList.prototype.setPriorityOfItems = function(){
  this.listItems.each(function(index, item){
    if(!$(item).data("priority-order")){
      $(item).data("priority-order", 0);
    }
  });
}
PriorityList.prototype.createButton = function(){
  this.button = $("<input>").attr("type", "button").val("See less");
  this.list.after(this.button);
}

PriorityList.prototype.bindClickEvent = function(){
  var _this = this;
  this.button.on("click", function(){
    if(_this.seeAll){
      $(this).val("See All");
      _this.seeAll = false;
    } else {
      $(this).val("See less");
      _this.seeAll = true;
    }
    _this.show(_this.sortByClicked.data("type"), _this.sortOrderClicked.data("type"));

  })
}

PriorityList.prototype.sortByPriority = function(sortingOrder, items){
  var priority = items.toArray();
  priority.sort(function(listItem1, listItem2){
    var first = $(listItem1).data("priority-order");
    var second = $(listItem2).data("priority-order");
    if(sortingOrder == "ascending"){
      return second - first;
    } else {
      return first - second;
    }
  });
  return priority;
}

PriorityList.prototype.sortByAlphabets = function(sortingOrder, items){
  var allListItems = items.toArray();
  var i = 1;
  allListItems.sort(function(listItem1, listItem2){
    i = (sortingOrder == "ascending") ? 1 : -1;
    if($(listItem1).text() > $(listItem2).text()){
      return 1 * i;
    }
    else{
      return -1 * i;
    }
  });

  return allListItems;
}

PriorityList.prototype.show = function(sortBy, sortingOrder){
  var itemsToShow;
  var items = [];
  var _this = this;
  if(this.seeAll){
    itemsToShow = this.listItems.length;
    items = this.listItems;
  } else{
    itemsToShow = this.initialCount;
    this.listItems.each(function(index, item){
      if($(item).data("priority-order")> 0){
        items.push(item);
      } else {
        _this.hiddenList.push(item);
      }
    })
  }

  var sortedList;
  if(sortBy == "priority"){
    // this.showPriority(sortingOrder, itemsToShow, $(items));
    sortedList = this.sortByPriority(sortingOrder, $(items));
    // this.sortedDisplay(sortedList, items);
  } else{
    // this.showAlphabetically(sortingOrder, itemsToShow, $(items));
    sortedList = this.sortByAlphabets(sortingOrder, $(items));
    // this.sortedDisplay(sortedList, items);
  }
  this.sortedDisplay(sortedList, itemsToShow);
}

PriorityList.prototype.sortedDisplay = function(sortedList, itemsToShow){
  var _this = this;
  $(sortedList).show();
  var visibleList = sortedList.slice(0, itemsToShow);
  this.hiddenList.push(sortedList.slice(itemsToShow, sortedList.length));
  this.hiddenList.forEach(function(item, index){
    $(item).hide();
  })
  visibleList.forEach(function(item, index){
    _this.list.append($(item));
  })
  this.hiddenList = [];
}

// PriorityList.prototype.showPriority = function(sortingOrder, itemsToShow, items){
//   var _this = this;
//   var sortedList = this.sortByPriority(sortingOrder, items);
//   $(sortedList).show();
//   var visibleList = sortedList.slice(0, itemsToShow);
//   this.hiddenList.push(sortedList.slice(itemsToShow, sortedList.length));
//   this.hiddenList.forEach(function(item, index){
//     $(item).hide();
//   })
//   visibleList.forEach(function(item, index){
//     _this.list.append($(item));
//   })
//   this.hiddenList = [];
// }

// PriorityList.prototype.showAlphabetically = function(sortingOrder, itemsToShow, items){
//   var _this = this;
//   var sortedList = this.sortByAlphabets(sortingOrder, items);
//   $(sortedList).show();
//   var visibleList = sortedList.slice(0, itemsToShow);
//   this.hiddenList.push(sortedList.slice(itemsToShow, sortedList.length));
//   this.hiddenList.forEach(function(item, index){
//     $(item).hide();
//   })
//   visibleList.forEach(function(item, index){
//     _this.list.append($(item));
//   })
//   this.hiddenList = [];
// }
///////////////////////////////////////////////////////////
$(document).ready(function(){
  domElements = {
    //TODO
    lists: $("ul").filter(".priority-sort"),
  };

  var prioritySort = new PrioritySort(domElements);
  prioritySort.init();
});
