const qaList = [
    { q: "파이썬의 창시자는?", a: "귀도 반 로썸" },
    { q: "HTML의 약자는?", a: "HyperText Markup Language" },
    { q: "대한민국의 수도는?", a: "서울" }
];

let currentIndex = -1;

function showQuestion() {
    const randomIndex = Math.floor(Math.random() * qaList.length);
    currentIndex = randomIndex;
    document.getElementById("question").innerText = qaList[randomIndex].q;
    document.getElementById("answer").style.display = "none";
}

document.getElementById("show-answer").addEventListener("click", () => {
    document.getElementById("answer").innerText = qaList[currentIndex].a;
    document.getElementById("answer").style.display = "block";
});

document.getElementById("next-question").addEventListener("click", () => {
    showQuestion();
});

showQuestion();