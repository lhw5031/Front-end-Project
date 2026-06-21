// ==========================================
// [1] 데이터 저장고 (상자) 영역
// ==========================================

// 【검색어 지도 상자】
// const는 "한 번 정하면 절대 바꿀 수 없는 금고 같은 상자"를 만들 때 씁니다.
// 사용자가 검색창에 단어를 치면 어떤 웹페이지 파일(.html)로 보내줄지 미리 연결해 둔 지도입니다.
const searchMap = {
  oop: "OOP.html#what-is-oop", // 'oop'를 검색하면 OOP.html 페이지의 #what-is-oop 위치로 바로 점프!
  "oop란?": "OOP.html#what-is-oop", // 'oop란?'을 검색해도 똑같은 곳으로 보냅니다.
  객체: "OOP.html#object", // 이하 동문으로 단어와 주소를 짝지어 준 것입니다.
  클래스: "OOP.html#class",
  상속: "OOP.html#inheritance",
  다형성: "OOP.html#polymorphism",
  추상화: "OOP.html#abstraction",
  solid: "OOP.html#solid",
  java: "Java.html#what-is-java",
  "java 생성자": "Java.html#constructor",
  "java arraylist": "Java.html#arraylist",
  "java hashmap": "Java.html#hashmap",
  python: "Python.html#what-is-python",
  "python 리스트": "Python.html#list",
  "python 클래스": "Python.html#class",
  "python 딕셔너리": "Python.html#dictionary",
  compare: "compare.html",
  "코드 문법 비교": "compare.html#syntax-compare",
  건의: "suggestion.html",
};

// 【예시 코드 상자】
// 컴퓨터가 Java 코드를 Python으로, 혹은 반대로 바꿀 때 기본적으로 보여줄 '가짜 예시 코드'들을 채워놓은 상자입니다.
const sampleCode = {
  // '자바에서 파이썬으로' 변환할 때 쓸 자바 샘플 코드
  "java-to-python": `class Dog extends Animal {
  public Dog(String name) {
    this.name = name;
  }

  public void speak() {
    System.out.println(name + " bark");
  }
}`,
  // '파이썬에서 자바로' 변환할 때 쓸 파이썬 샘플 코드
  "python-to-java": `class Dog(Animal):
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(self.name + " bark")`,
};

// ==========================================
// [2] 웹페이지 시작 버튼 누르기 영역
// ==========================================

// 인터넷 창이 처음 딱 열렸을 때, 아래에 만들어 둔 로봇(함수)들을 순서대로 작동(호출)시킵니다.
setupSearch(); // 1. 검색창아, 작동할 준비 하렴!
setupCopyButtons(); // 2. 소스코드 옆에 '복사' 버튼들을 붙이렴!
setupTranslator(); // 3. 자바-파이썬 코드 변환기를 준비하렴!
setupThemeButton(); // 4. 다크모드/라이트모드 바꾸는 버튼을 연결하렴!
loadTheme(); // 5. 이전에 다크모드를 켰었는지 기억을 더듬어 불러오렴!
setupSuggestionForm(); // 6. 건의사항 적는 게시판 양식을 준비하렴!

// ==========================================
// [3] 진짜 기능을 담당하는 로봇(함수, Function) 영역
// ==========================================

// 🔍 【기능 1: 똑똑한 검색창 로봇】
function setupSearch() {
  // 웹사이트에 있는 모든 검색창 양식(form)들을 모조리 찾아와서 하나씩 명령을 내립니다.
  document
    .querySelectorAll("[data-search-form], .hero .search-box")
    .forEach(function (form) {
      // 사용자가 검색창에 글을 쓰고 '엔터'를 치거나 '검색 버튼'을 누르는 이벤트(submit)를 감시합니다.
      form.addEventListener("submit", function (event) {
        // 중요! 원래 검색창은 엔터를 치면 새로고침이 되는데, 자바스크립트로 직접 제어하기 위해 그 행동을 '강제로 막음(preventDefault)' 합니다.
        event.preventDefault();

        // 사용자가 입력한 글자에서 앞뒤 쓸데없는 공백을 지우고(.trim), 영어인 경우 소문자로 통일(.toLowerCase)해서 keyword라는 상자에 담습니다.
        const keyword = form.querySelector("input").value.trim().toLowerCase();

        // 우리가 맨 위에 만든 지도(searchMap)에서 사용자가 친 키워드가 있는지 찾고, 있으면 그 주소로 이동! 없으면 기본 홈화면("home.html")으로 보냅니다.
        location.href = searchMap[keyword] || "home.html";
      });
    });
}

// 📋 【기능 2: 코드 복사 버튼 달아주기 로봇】
function setupCopyButtons() {
  // 웹사이트 화면에서 코드가 들어가는 상자들(.code-box, .compare-card)을 몽땅 찾아서 하나씩 처리합니다.
  document.querySelectorAll(".code-box, .compare-card").forEach(function (box) {
    // 그 상자 안에 진짜 글자 코드가 적혀있는 <code> 태그가 있는지 확인합니다.
    const code = box.querySelector("code");
    // 만약 코드가 들어있지 않은 빈 상자라면, 복사 버튼을 만들 필요가 없으니 그냥 스킵(!code)합니다.
    if (!code) return;

    // 인터넷 브라우저 메모리에 <button> 이라는 태그(버튼)를 새로 하나 창조합니다.
    const button = document.createElement("button");
    button.type = "button"; // 버튼 종류는 일반 버튼으로 설정
    button.className = "copy-code-btn"; // 예쁘게 꾸밀 수 있도록 CSS 옷(클래스 별명)을 입혀줍니다.
    button.textContent = "복사"; // 버튼에 눈으로 보일 글자를 '복사'라고 적어줍니다.

    // 이 새로 만든 버튼을 클릭했을 때 일어날 일을 정해줍니다.
    button.addEventListener("click", function () {
      // 아래에 따로 만든 copyText라는 똑똑한 복사 로봇에게 코드 내용과 이 버튼을 넘겨주며 실행시킵니다.
      copyText(code.textContent, button);
    });
    // 다 만든 복사 버튼을 코드 상자 내부의 막내 자식으로 쏙 집어넣어 화면에 띄웁니다.
    box.appendChild(button);
  });
}

// ⚡ 【기능 2-1: 진짜로 글자를 클립보드에 복사하는 특수 로봇】
// async는 "컴퓨터야, 이 일은 복사하는 데 시간이 0.001초 걸릴 수 있으니까 차분히 기다리면서 처리하렴"이라는 뜻입니다.
async function copyText(text, button) {
  try {
    // 브라우저 내부의 최신 복사 기능(clipboard)을 사용해 글자를 컨트롤+C 시킵니다. await는 완료될 때까지 기다리라는 의미입니다.
    await navigator.clipboard.writeText(text);
    button.textContent = "복사됨"; // 복사에 성공하면 버튼 글자를 '복사됨'으로 교체합니다.
  } catch {
    // 혹시 브라우저 보안 차단 등으로 복사에 실패하면 버튼 글자를 '실패'라고 바꿉니다.
    button.textContent = "실패";
  }

  // 1.2초(1200밀리초) 뒤에 괄호 안의 행동을 실행하는 타이머를 켭니다.
  setTimeout(function () {
    button.textContent = "복사"; // 1.2초가 지나면 버튼 글자를 다시 원래대로 '복사'로 돌려놓습니다.
  }, 1200);
}

// 🔄 【기능 3: Java ↔ Python 코드 변환기 총괄 로봇】
function setupTranslator() {
  // 왼쪽 코드 입력창(#sourceCode)과 오른쪽 결과 출력창(#targetCode)을 찾아옵니다.
  const sourceCode = document.querySelector("#sourceCode");
  const targetCode = document.querySelector("#targetCode");
  // 만약 변환기 창이 없는 다른 일반 페이지라면 할 일이 없으므로 즉시 함수를 종료(!sourceCode...)합니다.
  if (!sourceCode || !targetCode) return;

  // 현재 변환 방향을 기억하는 변수입니다. 처음 페이지를 열면 '자바를 파이썬으로 바꾸기' 모드로 시작합니다.
  // let은 const와 달리 나중에 내용물(방향)을 바꿀 수 있는 상자입니다.
  let direction = "java-to-python";
  // 왼쪽, 오른쪽 화면에 띄워줄 언어 이름표(Java, Python 글자)를 찾아옵니다.
  const sourceLabel = document.querySelector("#sourceLabel");
  const targetLabel = document.querySelector("#targetLabel");

  // [속 기능 A]: 변환 방향이 바뀔 때마다 모든 라벨과 디자인을 싹 리모델링하는 함수입니다.
  function changeDirection(nextDirection) {
    direction = nextDirection; // 새로운 방향(예: 파이썬->자바)을 변수에 덮어씁니다.

    // 화면에 있는 방향 선택 버튼들을 전부 조사합니다.
    document.querySelectorAll("[data-direction]").forEach(function (button) {
      // 지금 선택한 방향과 일치하는 버튼에만 'active(활성화 색상)' 불을 켜고, 나머지는 불을 끕니다(toggle).
      button.classList.toggle("active", button.dataset.direction === direction);
    });

    // 지금 변환 방향이 '자바가 먼저' 인가요? 물어보고 맞으면 true, 틀리면 false를 저장합니다.
    const isJavaFirst = direction === "java-to-python";
    // 삼항 연산자(?:): isJavaFirst가 참이면 "Java", 거짓이면 "Python"을 이름표에 적어줍니다.
    sourceLabel.textContent = isJavaFirst ? "Java" : "Python";
    targetLabel.textContent = isJavaFirst ? "Python" : "Java";

    // 방향이 바뀌었으니 그 방향에 맞는 예시 코드(아까 2번 영역에서 만든 가짜 코드)를 왼쪽 창에 자동으로 채워줍니다.
    sourceCode.value = sampleCode[direction];
    // 글자가 채워졌으니 즉시 변환 함수를 돌려서 오른쪽 창에도 결과를 보여줍니다.
    convertCode();
  }

  // [속 기능 B]: 실제로 글자를 읽어서 번역기 마법 함수들을 실행하는 함수입니다.
  function convertCode() {
    // 현재 방향이 '자바->파이썬'이면 아래에 만든 javaToPython 함수를 실행하고, 반대면 pythonToJava 함수를 실행해 오른쪽 창(.value)에 띄웁니다.
    targetCode.value =
      direction === "java-to-python"
        ? javaToPython(sourceCode.value)
        : pythonToJava(sourceCode.value);
  }

  // [속 기능 C]: 왼쪽과 오른쪽의 코드를 서로 휙 맞바꾸는(스왑) 함수입니다.
  function swapDirection() {
    // 현재 오른쪽 결과창에 나온 완성본 코드를 잠시 임시 상자(convertedCode)에 보관합니다.
    const convertedCode = targetCode.value;
    // 현재 방향의 반대 방향을 계산합니다.
    const nextDirection =
      direction === "java-to-python" ? "python-to-java" : "java-to-python";

    // 계산된 반대 방향으로 화면 이름표와 설정을 바꿉니다.
    changeDirection(nextDirection);
    // 아까 보관해둔 완성본 코드를 이제 왼쪽 입력창에다가 밀어 넣습니다.
    sourceCode.value = convertedCode;
    // 그 상태로 다시 변환기를 새로 가동합니다.
    convertCode();
  }

  // 방향 바꾸기 버튼들(Java->Python 버튼 등)을 찾아서 클릭 이벤트를 연결해 줍니다.
  document.querySelectorAll("[data-direction]").forEach(function (button) {
    button.addEventListener("click", function () {
      // 버튼에 숨겨진 글자(dataset.direction)를 읽어서 방향 변경 함수를 실행합니다.
      changeDirection(button.dataset.direction);
    });
  });

  // 변환기 페이지 안에 있는 갖가지 버튼들(변환하기, 샘플보기, 바꾸기 등)의 클릭 이벤트를 꼼꼼히 연결합니다.
  document.querySelector("#convertBtn").addEventListener("click", convertCode); // 변환 버튼 누르면 변환!
  document.querySelector("#sampleBtn").addEventListener("click", function () {
    changeDirection(direction); // 샘플 버튼 누르면 현재 모드의 샘플을 다시 리셋해서 보여줌
  });
  document.querySelector("#swapBtn").addEventListener("click", swapDirection); // 스왑 버튼 누르면 서로 교체!
  document
    .querySelector("#centerSwapBtn")
    .addEventListener("click", swapDirection); // 가운데 아이콘 버튼 눌러도 교체!
  document.querySelector("#clearBtn").addEventListener("click", function () {
    // 지우기 버튼을 누르면 양쪽 텍스트 입력창을 빈 글자("")로 만듭니다.
    sourceCode.value = "";
    targetCode.value = "";
  });
  document
    .querySelector("#copyBtn")
    .addEventListener("click", function (event) {
      // 결과 복사 버튼을 누르면 오른쪽 창의 텍스트를 복사하도록 복사 로봇에게 지시합니다.
      copyText(targetCode.value, event.target);
    });

  // 사용자가 왼쪽 입력창에 대고 키보드를 칠 때마다(input 이벤트) 실시간으로 번역 결과가 갱신되게 만듭니다.
  sourceCode.addEventListener("input", convertCode);

  // 변환기 세팅이 완벽히 끝났으니 최초로 화면을 자바->파이썬 기본 모드로 한 번 강제 실행해 줍니다.
  changeDirection(direction);
}

// 🌗 【기능 4: 다크모드 / 라이트모드 전등 스위치 로봇】
function setupThemeButton() {
  const themeButton = document.querySelector("#themeToggle");
  if (!themeButton) return; // 전등 스위치 버튼이 없는 페이지라면 종료!

  themeButton.addEventListener("click", function () {
    // 웹사이트 전체를 감싸는 <body> 태그에 'light-mode'라는 이름표(클래스)를 붙였다가, 이미 있으면 빼버립니다. (켰다 껐다 토글)
    document.body.classList.toggle("light-mode");
    // 바뀐 상태를 컴퓨터 하드디스크에 저장하라고 지시합니다.
    saveTheme();
  });
}

// 💾 【기능 4-1: 유저가 고른 테마를 컴퓨터에 저장해두는 비밀 수첩】
function saveTheme() {
  // 만약 현재 화면이 라이트모드 이름표를 가지고 있다면
  if (document.body.classList.contains("light-mode")) {
    // 브라우저 간이 저장소(localStorage)에 "theme"를 "light"라고 적어둡니다.
    localStorage.setItem("theme", "light");
  } else {
    // 아니라면 "theme"를 "dark"라고 적어둡니다.
    localStorage.setItem("theme", "dark");
  }
}

// ⏳ 【기능 4-2: 새로고침을 하거나 다른 페이지로 가도 원래 쓰던 테마를 기억해내는 로봇】
function loadTheme() {
  // 브라우저 간이 저장소에서 "theme" 쪽지를 꺼내와 읽어봅니다.
  const savedTheme = localStorage.getItem("theme");

  // 만약 적혀있던 글자가 "light"라면!
  if (savedTheme === "light") {
    // <body> 태그에 다시 'light-mode' 클래스를 붙여서 화면을 밝게 켜줍니다.
    document.body.classList.add("light-mode");
  }
}

// 📝 【기능 5: 의견을 남기는 건의 사항 게시판 관리 로봇】
function setupSuggestionForm() {
  // 건의 사항 페이지에 필요한 5가지 핵심 부품(입력 폼, 선택 상자, 본문 입력창, 목록 리스트, 전체 삭제 버튼)을 찾아옵니다.
  const form = document.querySelector("#suggestionForm");
  const pageSelect = document.querySelector("#suggestionPage");
  const textBox = document.querySelector("#suggestionText");
  const list = document.querySelector("#suggestionList");
  const clearButton = document.querySelector("#clearSuggestions");

  // 부품이 하나라도 없는 일반 페이지라면 작동을 안 하고 즉시 종료합니다.
  if (!form || !pageSelect || !textBox || !list) return;

  // 이전에 저장되어 있던 소중한 의견 목록이 있다면 화면에 리스트로 그려줍니다.
  showSuggestions();

  // 사용자가 '건의 등록' 버튼을 누르면(submit) 작동하는 서약서입니다.
  form.addEventListener("submit", function (event) {
    // 새로고침 되는 것을 막습니다.
    event.preventDefault();

    // 쓴 내용에서 앞뒤 빈칸을 잘라냅니다.
    const text = textBox.value.trim();
    // 만약 한 글자도 안 적고 등록을 눌렀다면 저장을 거부하고 취소(return)합니다.
    if (text === "") return;

    // 하나의 건의사항 세트 상품(객체)을 구성합니다.
    const suggestion = {
      page: pageSelect.value, // 어떤 페이지에 대한 건의인지
      text: text, // 건의 알맹이 내용
      date: new Date().toLocaleString(), // 글을 쓴 현재 날짜와 시간 정보
    };

    // 기존 수첩에 저장되어 있던 건의사항 배열 리스트를 꺼내옵니다.
    const suggestions = getSuggestions();
    // 이번에 새로 쓴 따끈따끈한 건의사항 세트를 리스트 맨 뒤에 집어넣습니다.
    suggestions.push(suggestion);
    // 배열 리스트 전체를 글자 형태(JSON 문자열)로 꽁꽁 압축해서 브라우저 보관함에 쏙 저장합니다.
    localStorage.setItem("suggestions", JSON.stringify(suggestions));

    // 글을 다 썼으니 입력창 칸은 다시 깨끗하게 비워줍니다.
    textBox.value = "";
    // 최신 글까지 포함해서 게시판 화면 리스트를 다시 새로고침해서 그립니다.
    showSuggestions();
  });

  // '전체 삭제' 버튼을 클릭했을 때의 규칙입니다.
  clearButton.addEventListener("click", function () {
    // 브라우저 보관함에서 건의사항 목록 쪽지를 통째로 불태워 지워버립니다.
    localStorage.removeItem("suggestions");
    // 텅 비어버린 목록을 화면에 다시 그립니다.
    showSuggestions();
  });
}

// 🗂️ 【기능 5-1: 압축된 건의사항을 수첩에서 꺼내 안전하게 압축 해제하는 로봇】
function getSuggestions() {
  const savedSuggestions = localStorage.getItem("suggestions");

  // 만약 저장된 데이터 쪽지가 실재한다면
  if (savedSuggestions) {
    // 글자 형태로 압축되어 있던 가짜 데이터를 진짜 자바스크립트 배열 리스트로 변환(JSON.parse)해서 돌려줍니다.
    return JSON.parse(savedSuggestions);
  }

  // 아무것도 적힌 게 없는 새 수첩이라면 텅 빈 리스트([])를 건넵니다.
  return [];
}

// 🖥️ 【기능 5-2: 데이터 수첩을 기반으로 눈에 보이는 HTML 목록을 그려주는 그리기 로봇】
function showSuggestions() {
  const list = document.querySelector("#suggestionList");
  const suggestions = getSuggestions(); // 수첩 꺼내오기

  if (!list) return;

  // 만약 저장된 의견이 단 한 개도 없다면
  if (suggestions.length === 0) {
    // 리스트에 "아직 등록된 건의가 없습니다"라는 안내 한 줄을 넣고 그리기 종료합니다.
    list.innerHTML =
      '<li class="empty-suggestion">아직 등록된 건의가 없습니다.</li>';
    return;
  }

  // 기존 화면에 지저분하게 그려져 있던 낡은 글 목록들을 한 번 싹 지워 비웁니다.
  list.innerHTML = "";

  // 저장된 건의사항 리스트를 맨 첫 번째 글부터 마지막 글까지 하나씩 꺼내어 반복 연산(forEach)합니다.
  suggestions.forEach(function (suggestion, index) {
    // 목록 한 줄을 담당할 <li> 태그 부품을 생성합니다.
    const item = document.createElement("li");

    // <li> 태그 안에 들어갈 알맹이 HTML 뼈대를 글자들을 덧붙여서 완성해 줍니다. (관련페이지명, 삭제버튼, 글내용, 등록날짜)
    item.innerHTML =
      '<div class="suggestion-item-top">' +
      "<strong>" +
      suggestion.page +
      '</strong><button class="suggestion-delete" type="button">삭제</button></div><p>' +
      suggestion.text +
      "</p><span>" +
      suggestion.date +
      "</span>";

    // 방금 만든 따끈따끈한 한 줄 속에서 '삭제' 버튼을 찾아서 클릭 이벤트를 달아줍니다.
    item
      .querySelector(".suggestion-delete")
      .addEventListener("click", function () {
        // 삭제 버튼을 누르면 "컴퓨터야, 이 글이 몇 번째(index) 글인지 알아내서 지우렴" 하고 지우기 로봇을 부릅니다.
        deleteSuggestion(index);
      });
    // 완벽히 조립된 <li> 부품 한 줄을 실제 게시판 큰 목록 상자(list)에 척 달라붙입니다.
    list.appendChild(item);
  });
}

// ❌ 【기능 5-3: 특정 번호표를 가진 글 딱 하나만 저격해서 제거하는 로봇】
function deleteSuggestion(index) {
  const suggestions = getSuggestions(); // 수첩을 가져옵니다.
  // splice(번호, 개수) 명령어는 리스트의 특정 번호 위치에서 글을 딱 1개만 도려내어 삭제합니다.
  suggestions.splice(index, 1);
  // 한 개가 사라진 날씬해진 새 리스트를 다시 압축하여 보관함에 덮어쓰기 저장합니다.
  localStorage.setItem("suggestions", JSON.stringify(suggestions));
  // 화면 목록을 다시 갱신해서 보여줍니다.
  showSuggestions();
}

// ==========================================
// [4] 글자 바꿔치기 마법 정규표현식(Regex) 영역
// ==========================================

// ☕ ➔ 🐍 【마법 1: Java 문법 글자들을 찾아서 Python 모양으로 일괄 개조하기】
function javaToPython(code) {
  return (
    code
      // .replace(/찾을패턴/g, "바꿀글자") 문법은 글자 코드 전체에서 특정 자바 규칙을 찾아 파이썬 스타일로 교체합니다.

      // 1. 자바 상속 구조(class 자식 extends 부모 {)를 파이썬 상속(class 자식(부모):)으로 치환!
      .replace(/class (\w+) extends (\w+) \{/g, "class $1($2):")

      // 2. 자바 일반 클래스(class 이름 {)을 파이썬 클래스(class 이름:)로 변경!
      .replace(/class (\w+) \{/g, "class $1:")

      // 3. 자바 생성자 함수(public 클래스명(타입 변수) {)를 파이썬 초기화 함수(def __init__(self, 변수):)로 변경!
      .replace(
        /public \w+\((String )?(\w+)\) \{/g,
        "    def __init__(self, $2):",
      )

      // 4. 자바 일반 void 메서드(public void 메서드명() {)를 파이썬 함수(def 메서드명(self):)로 변경!
      .replace(/public void (\w+)\(\) \{/g, "    def $1(self):")

      // 5. 자바에서 자기를 뜻하던 'this.' 글자를 파이썬의 'self.'으로 전부 바꿔치기!
      .replace(/this\./g, "self.")

      // 6. 자바의 화면 콘솔 출력문(System.out.println(...);)을 파이썬의 단순한 print(...)로 일괄 수정!
      .replace(/System\.out\.println\((.*?)\);/g, "print($1)")

      // 7. 파이썬에서는 절대 쓰지 않고 에러를 유발하는 중괄호({},)와 문장 끝 세미콜론(;)을 모조리 찾아서 공백("")으로 지워버림!
      .replace(/[{};]/g, "")

      // 8. 글자 덩어리를 엔터(\n) 기준으로 한 줄 한 줄 쪼개서 줄 단위 배열 리스트로 만듭니다.
      .split("\n")

      // 9. 한 줄씩 읽으면서, 자바에만 있는 'private 변수 선언문' 줄은 파이썬 코딩창에 있으면 이상하므로 걸러서 삭제(filter)합니다.
      .filter(function (line) {
        return !line.trim().startsWith("private");
      })

      // 10. 조각조각 잘려있던 코드 줄들을 다시 엔터(\n)를 사이에 끼워 넣으며 하나의 긴 글자 코드로 합쳐줍니다.
      .join("\n")
  );
}

// 🐍 ➔ ☕ 【마법 2: 반대로 Python 코드를 자바 스타일 흉내쟁이 코드로 개조하기】
function pythonToJava(code) {
  // 자바는 생성자 이름을 클래스 이름과 무조건 일치시켜야 하므로, 정규식으로 'class 이름' 부문을 추적해서 클래스 이름을 미리 알아냅니다.
  const classMatch = code.match(/class (\w+)/);
  // 이름을 정상적으로 발견했다면 1번 저장소($1) 글자를 쓰고, 없으면 기본 단어인 "ClassName"을 채택합니다.
  const className = classMatch ? classMatch[1] : "ClassName";

  return (
    code
      // 1. 파이썬 상속(class 자식(부모):)을 자바 상속(class 자식 extends 부모 {) 모양으로 변경!
      .replace(/class (\w+)\((\w+)\):/g, "class $1 extends $2 {")

      // 2. 파이썬 일반 클래스(class 이름:)를 자바 클래스(class 이름 {) 모양으로 변경!
      .replace(/class (\w+):/g, "class $1 {")

      // 3. 파이썬 생성자(def __init__(self, 변수):)를 자바 생성자 구조(public 클래스이름(String 변수) {)로 교체합니다. 위에서 구한 className 상자가 쓰입니다.
      .replace(
        /def __init__\(self, ?(\w+)\):/g,
        `  public ${className}(String $1) {`,
      )

      // 4. 파이썬 메서드 정의(def 이름(self):)를 자바 void 메서드( } \n public void 이름() {) 형태로 바꿉니다. (위에서 열어두었던 생성자 중괄호를 여기서 대신 닫아줍니다!)
      .replace(/def (\w+)\(self\):/g, "  }\n\n  public void $1() {")

      // 5. 파이썬의 'self.' 글자를 자바용 단어인 'this.'으로 교체합니다.
      .replace(/self\./g, "this.")

      // 6. 파이썬의 print(...) 문장을 자바 정식 출력문인 System.out.println(...); 형태로 치환합니다.
      .replace(/print\((.*?)\)/g, "System.out.println($1);")

      // 7. 자바는 문장 끝에 무조건 마침표 역할을 하는 세미콜론(;)을 붙여야 합니다. 띄어쓰기가 4칸 되어있는 실행 구문 중 끝에 세미콜론이나 중괄호가 없는 줄을 골라 끝에 세미콜론(;)을 강제로 덧붙여줍니다.
      .replace(/^ {4}(.+[^;{])$/gm, "    $1;")

      // 8. 마지막으로 코드 맨 밑바닥에 메서드 닫는 괄호와 클래스 전체를 완전히 닫아줄 중괄호 세트("\n  }\n}")를 꼬리에 예쁘게 붙여서(concat) 최종 완성본을 리턴합니다.
      .concat("\n  }\n}")
  );
}
