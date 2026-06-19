// 검색어와 이동할 문서 위치를 연결한 표입니다.
const searchMap = {
  oop: "OOP.html#what-is-oop",
  "oop란?": "OOP.html#what-is-oop",
  객체: "OOP.html#object",
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

// Compare 페이지에서 버튼을 눌렀을 때 넣어줄 예시 코드입니다.
const sampleCode = {
  "java-to-python": `class Dog extends Animal {
  public Dog(String name) {
    this.name = name;
  }

  public void speak() {
    System.out.println(name + " bark");
  }
}`,
  "python-to-java": `class Dog(Animal):
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(self.name + " bark")`,
};

// 페이지가 열리면 검색, 복사, 변환기 기능을 각각 연결합니다.
setupSearch();
setupCopyButtons();
setupTranslator();
setupThemeButton();
loadTheme();
setupSuggestionForm();

// 검색창에 입력한 단어가 searchMap에 있으면 해당 위치로 이동합니다.
function setupSearch() {
  // data-search-form은 상단 검색창, .hero .search-box는 홈 화면 큰 검색창입니다.
  document.querySelectorAll("[data-search-form], .hero .search-box").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      // form은 기본적으로 새로고침을 하므로, JS로 이동 처리하기 위해 막습니다.
      event.preventDefault();

      // 검색어는 앞뒤 공백을 제거하고 소문자로 맞춰 searchMap과 비교합니다.
      const keyword = form.querySelector("input").value.trim().toLowerCase();
      // 등록된 검색어면 해당 문서로, 없으면 홈으로 이동합니다.
      location.href = searchMap[keyword] || "home.html";
    });
  });
}

// 모든 코드 박스에 복사 버튼을 자동으로 붙입니다.
function setupCopyButtons() {
  // .code-box는 일반 코드 예시, .compare-card는 Java/Python 비교 카드입니다.
  document.querySelectorAll(".code-box, .compare-card").forEach(function (box) {
    const code = box.querySelector("code");
    // 코드가 없는 카드에는 복사 버튼을 만들 필요가 없습니다.
    if (!code) return;

    // HTML에 버튼을 반복해서 쓰지 않기 위해 JS로 버튼을 만들어 붙입니다.
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code-btn";
    button.textContent = "복사";
    button.addEventListener("click", function () {
      copyText(code.textContent, button);
    });
    box.appendChild(button);
  });
}

// 전달받은 텍스트를 클립보드에 복사하고 버튼 문구를 잠깐 바꿉니다.
async function copyText(text, button) {
  try {
    // 브라우저의 Clipboard API를 사용해 코드를 복사합니다.
    await navigator.clipboard.writeText(text);
    button.textContent = "복사됨";
  } catch {
    // 브라우저 설정이나 권한 문제로 실패하면 실패 표시를 합니다.
    button.textContent = "실패";
  }

  // 1.2초 뒤 버튼 문구를 원래대로 돌립니다.
  setTimeout(function () {
    button.textContent = "복사";
  }, 1200);
}

// Compare 페이지에만 있는 코드 변환기 버튼들을 연결합니다.
function setupTranslator() {
  // 다른 페이지에는 sourceCode/targetCode가 없으므로 바로 종료합니다.
  const sourceCode = document.querySelector("#sourceCode");
  const targetCode = document.querySelector("#targetCode");
  if (!sourceCode || !targetCode) return;

  // 현재 변환 방향입니다. 처음에는 Java에서 Python으로 변환합니다.
  let direction = "java-to-python";
  const sourceLabel = document.querySelector("#sourceLabel");
  const targetLabel = document.querySelector("#targetLabel");

  // 변환 방향이 바뀌면 라벨, active 버튼, 샘플 코드를 함께 바꿉니다.
  function changeDirection(nextDirection) {
    direction = nextDirection;

    // 현재 선택된 방향 버튼에만 active 클래스를 붙입니다.
    document.querySelectorAll("[data-direction]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.direction === direction);
    });

    // 방향에 따라 왼쪽/오른쪽 언어 이름을 바꿉니다.
    const isJavaFirst = direction === "java-to-python";
    sourceLabel.textContent = isJavaFirst ? "Java" : "Python";
    targetLabel.textContent = isJavaFirst ? "Python" : "Java";
    // 방향을 바꿀 때는 그 방향에 맞는 샘플 코드를 입력창에 넣습니다.
    sourceCode.value = sampleCode[direction];
    convertCode();
  }

  // 현재 방향에 맞는 변환 함수를 실행합니다.
  function convertCode() {
    // 삼항 연산자로 현재 방향에 맞는 변환 함수를 선택합니다.
    targetCode.value =
      direction === "java-to-python" ? javaToPython(sourceCode.value) : pythonToJava(sourceCode.value);
  }

  // 결과 코드를 반대쪽 입력값으로 옮기고 변환 방향을 바꿉니다.
  function swapDirection() {
    // 지금 결과값을 저장해 두었다가 방향을 바꾼 뒤 왼쪽 입력창으로 옮깁니다.
    const convertedCode = targetCode.value;
    const nextDirection = direction === "java-to-python" ? "python-to-java" : "java-to-python";

    changeDirection(nextDirection);
    sourceCode.value = convertedCode;
    convertCode();
  }

  // 방향 선택 버튼 2개에 클릭 이벤트를 연결합니다.
  document.querySelectorAll("[data-direction]").forEach(function (button) {
    button.addEventListener("click", function () {
      changeDirection(button.dataset.direction);
    });
  });

  // 변환기 안의 각 버튼에 기능을 연결합니다.
  document.querySelector("#convertBtn").addEventListener("click", convertCode);
  document.querySelector("#sampleBtn").addEventListener("click", function () {
    changeDirection(direction);
  });
  document.querySelector("#swapBtn").addEventListener("click", swapDirection);
  document.querySelector("#centerSwapBtn").addEventListener("click", swapDirection);
  document.querySelector("#clearBtn").addEventListener("click", function () {
    sourceCode.value = "";
    targetCode.value = "";
  });
  document.querySelector("#copyBtn").addEventListener("click", function (event) {
    copyText(targetCode.value, event.target);
  });
  // 사용자가 코드를 입력할 때마다 결과를 바로 갱신합니다.
  sourceCode.addEventListener("input", convertCode);

  // 페이지가 처음 열렸을 때 기본 샘플과 변환 결과를 표시합니다.
  changeDirection(direction);
}

// 다크모드 버튼을 누르면 body에 light-mode 클래스를 붙였다 뺐다 합니다.
function setupThemeButton() {
  const themeButton = document.querySelector("#themeToggle");
  if (!themeButton) return;

  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");
    saveTheme();
  });
}

// 현재 화면 모드를 브라우저에 저장합니다.
function saveTheme() {
  if (document.body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

// 다른 페이지로 이동해도 이전에 선택한 화면 모드를 다시 적용합니다.
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

// 건의 사항을 저장하고 화면에 다시 보여줍니다.
function setupSuggestionForm() {
  const form = document.querySelector("#suggestionForm");
  const pageSelect = document.querySelector("#suggestionPage");
  const textBox = document.querySelector("#suggestionText");
  const list = document.querySelector("#suggestionList");
  const clearButton = document.querySelector("#clearSuggestions");

  if (!form || !pageSelect || !textBox || !list) return;

  showSuggestions();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = textBox.value.trim();
    if (text === "") return;

    const suggestion = {
      page: pageSelect.value,
      text: text,
      date: new Date().toLocaleString(),
    };

    const suggestions = getSuggestions();
    suggestions.push(suggestion);
    localStorage.setItem("suggestions", JSON.stringify(suggestions));

    textBox.value = "";
    showSuggestions();
  });

  clearButton.addEventListener("click", function () {
    localStorage.removeItem("suggestions");
    showSuggestions();
  });
}

// 저장된 건의 사항 배열을 가져옵니다.
function getSuggestions() {
  const savedSuggestions = localStorage.getItem("suggestions");

  if (savedSuggestions) {
    return JSON.parse(savedSuggestions);
  }

  return [];
}

// 저장된 건의 사항을 목록으로 그립니다.
function showSuggestions() {
  const list = document.querySelector("#suggestionList");
  const suggestions = getSuggestions();

  if (!list) return;

  if (suggestions.length === 0) {
    list.innerHTML = "<li class=\"empty-suggestion\">아직 등록된 건의가 없습니다.</li>";
    return;
  }

  list.innerHTML = "";

  suggestions.forEach(function (suggestion, index) {
    const item = document.createElement("li");
    item.innerHTML =
      "<div class=\"suggestion-item-top\">" +
      "<strong>" +
      suggestion.page +
      "</strong><button class=\"suggestion-delete\" type=\"button\">삭제</button></div><p>" +
      suggestion.text +
      "</p><span>" +
      suggestion.date +
      "</span>";
    item.querySelector(".suggestion-delete").addEventListener("click", function () {
      deleteSuggestion(index);
    });
    list.appendChild(item);
  });
}

// 선택한 번호의 건의 사항만 삭제합니다.
function deleteSuggestion(index) {
  const suggestions = getSuggestions();
  suggestions.splice(index, 1);
  localStorage.setItem("suggestions", JSON.stringify(suggestions));
  showSuggestions();
}

// Java 코드에서 자주 보이는 문법을 Python 형태로 단순 치환합니다.
function javaToPython(code) {
  return code
    // Java 상속 문법: class Dog extends Animal { -> class Dog(Animal):
    .replace(/class (\w+) extends (\w+) \{/g, "class $1($2):")
    // Java 일반 클래스: class Dog { -> class Dog:
    .replace(/class (\w+) \{/g, "class $1:")
    // Java 생성자 형태를 Python __init__ 형태로 바꿉니다.
    .replace(/public \w+\((String )?(\w+)\) \{/g, "    def __init__(self, $2):")
    // Java void 메서드를 Python 메서드 형태로 바꿉니다.
    .replace(/public void (\w+)\(\) \{/g, "    def $1(self):")
    // Java의 this는 Python에서 self 역할입니다.
    .replace(/this\./g, "self.")
    // Java 출력문을 Python print로 바꿉니다.
    .replace(/System\.out\.println\((.*?)\);/g, "print($1)")
    // Python에는 중괄호와 세미콜론이 필요 없으므로 제거합니다.
    .replace(/[{};]/g, "")
    .split("\n")
    // private 필드 선언은 Python 예시에서는 생략합니다.
    .filter(function (line) {
      return !line.trim().startsWith("private");
    })
    .join("\n");
}

// Python 코드에서 자주 보이는 문법을 Java 형태로 단순 치환합니다.
function pythonToJava(code) {
  // 생성자 이름을 만들기 위해 Python 코드에서 클래스 이름을 먼저 찾습니다.
  const classMatch = code.match(/class (\w+)/);
  const className = classMatch ? classMatch[1] : "ClassName";

  return code
    // Python 상속 문법: class Dog(Animal): -> class Dog extends Animal {
    .replace(/class (\w+)\((\w+)\):/g, "class $1 extends $2 {")
    // Python 일반 클래스: class Dog: -> class Dog {
    .replace(/class (\w+):/g, "class $1 {")
    // Python __init__을 Java 생성자 형태로 바꿉니다.
    .replace(/def __init__\(self, ?(\w+)\):/g, `  public ${className}(String $1) {`)
    // Python 메서드를 Java void 메서드 형태로 바꿉니다.
    .replace(/def (\w+)\(self\):/g, "  }\n\n  public void $1() {")
    // Python self는 Java this와 비슷한 역할입니다.
    .replace(/self\./g, "this.")
    // Python print를 Java 출력문으로 바꿉니다.
    .replace(/print\((.*?)\)/g, "System.out.println($1);")
    // 들여쓰기된 실행문 끝에 Java 세미콜론을 붙입니다.
    .replace(/^ {4}(.+[^;{])$/gm, "    $1;")
    // 마지막에 메서드와 클래스 닫는 중괄호를 붙입니다.
    .concat("\n  }\n}");
}
