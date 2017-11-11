var CharacterData = function () {
  var character = [
    {
      "name": "똘똘이",
      "state": false,
      "mission": "기본",
      "mstate": true
    },
    {
      "name": "cactus",
      "state": false,
      "mission": "총 50쪽 이상 읽으세요",
      "mamount": 50,
      "mstate": false,
      "mpercent": ""
    },
    {
      "name": "rabbit",
      "state": false,
      "mission": "총 100쪽 이상 읽으세요",
      "mamount": 100,
      "mstate": false,
      "mpercent": ""
    },
    {
      "name": "Blowfish",
      "state": false,
      "mission": "총 500쪽 이상 읽으세요",
      "mamount": 500,
      "mstate": false,
      "mpercent": ""
    }
  ];

  this.getCharacter = function () {
    return character;
  }
  this.setUseCharacter = function (index) {
    character[index].state = true;
  }

  this.mission = function (data1, userindex, i) {
    var data2 = character[i].mamount;

    if (data1 >= data2) {
      character[i].mstate = true;
    } else {
      character[i].mstate = false;
      if (userindex === i) {
        userindex = 0;
      }
      character[i].mpercent = data1 + "/" + character[i].mamount;
    }

    return userindex;
  }

}