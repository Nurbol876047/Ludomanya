export const formulaSummary = [
  "T_year = 365h; P(H_T) = 1 - e^{-λT}",
  "P(L_t ≥ 1) = 1 - (1 - q)^t; E[L_t] = tqb",
  "S_{t+1} = M S_t; P(R_k) = 1 - (1 - r)^k",
  "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
  "P(A | B) = P(A ∩ B) / P(B)",
  "X̄_n = (1/n) ΣX_i; P(|X̄_n - μ| > ε) → 0",
  "P(W_k) = p^k; P(L ≥ 1) = 1 - p^n",
  "z = αv + βf - θ; P(I) = 1 / (1 + e^{-z})",
  "P(defense) = s / (s + r); P(risk) = r / (s + r)",
  "P(C ≥ 1) = 1 - (1 - a)^c; F_t = 1 - e^{-λc_t}"
];

export const timeLossHeroMath = {
  leftFormula: (
    <div className="text-[clamp(2rem,4.6vw,3.4rem)] font-serif italic text-white leading-none tracking-tighter">
      T<sub className="text-[0.45em]">year</sub>
      <span className="mx-3 text-white/40">=</span>
      365h
    </div>
  ),
  leftLabel: "жылдық уақыт шығыны",
  rightFormula: (
    <span className="text-[clamp(2rem,4.7vw,3.7rem)]">
      P(H<sub className="text-[0.45em]">T</sub>) = 1 - e<sup className="text-[0.45em]">-λT</sup>
    </span>
  ),
  rightLabel: "әдеттің күшею ықтималдығы",
  symbolsTitle: "Уақыт айнымалылары:",
  symbols: [
    ["h", "күніне ойынға кеткен сағат"],
    ["T", "жиналған уақыт көлемі"],
    ["λ", "әдеттің күшею қарқыны"]
  ],
  verdictTitle: "Есеп мәні:",
  verdict: (
    <>
      Уақыт көбейген сайын <b className="text-cyan-400">P(H<sub>T</sub>)</b> жоғарылайды.
    </>
  ),
  statementTitle: "Уақыт та ықтималдыққа айналады",
  statement:
    "Күн сайын қайталанған сағаттар әдет ықтималдығын өсіреді: уақыт жоғалту тек сан емес, тәуекелдің жинақталуы.",
  statementTextClassName: "text-lg sm:text-xl",
  watermark: "365h"
};

export const probabilityHeroMath = {
  leftFormula: (
    <div className="text-[clamp(1.8rem,4.3vw,3.35rem)] font-serif italic text-white leading-none tracking-tighter">
      P(A ∪ B)
      <span className="mx-3 text-white/40">=</span>
      P(A) + P(B) - P(A ∩ B)
    </div>
  ),
  leftLabel: "қосу ережесі",
  rightFormula: (
    <span className="flex flex-col items-end gap-1 text-[clamp(2rem,4.5vw,3.6rem)] sm:block">
      <span>P(A | B)</span>
      <span className="sm:ml-3">= P(A ∩ B) / P(B)</span>
    </span>
  ),
  rightLabel: "шартты ықтималдық",
  symbolsTitle: "Ықтималдық түрлері:",
  symbols: [
    ["P(A)", "бір оқиғаның ықтималдығы"],
    ["P(A ∪ B)", "екі оқиғаның кемі біреуі орындалуы"],
    ["P(A | B)", "B болғаннан кейін A ықтималдығы"]
  ],
  verdictTitle: "Математикалық түсінік:",
  verdict: (
    <>
      Бір оқиға бөлек тұрмайды: шарт, қиылысу және серия ықтималдықты өзгертеді.
    </>
  ),
  statementTitle: "Ықтималдықтың негізгі түрлері",
  statement:
    "Классикалық ықтималдық, қосу ережесі және шартты ықтималдық ойын нәтижесін нақтырақ түсіндіреді.",
  symbolsTextClassName: "text-lg sm:text-xl",
  verdictTextClassName: "text-lg sm:text-xl",
  statementTextClassName: "text-xl sm:text-2xl",
  watermark: "P(A|B)"
};

export const monteCarloHeroMath = {
  leftFormula: (
    <div className="text-[clamp(2rem,4.8vw,3.6rem)] font-serif italic text-white leading-none tracking-tighter">
      X̄<sub className="text-[0.45em]">n</sub>
      <span className="mx-3 text-white/40">=</span>
      (1/n) ΣX<sub className="text-[0.45em]">i</sub>
    </div>
  ),
  leftLabel: "симуляцияның орташа нәтижесі",
  rightFormula: (
    <span className="flex flex-col items-end gap-1 text-[clamp(1.8rem,4.1vw,3.4rem)] sm:block">
      <span>P(|X̄<sub className="text-[0.45em]">n</sub> - μ| &gt; ε)</span>
      <span className="sm:ml-3">→ 0</span>
    </span>
  ),
  rightLabel: "үлкен сандар заңы",
  symbolsTitle: "Симуляция айнымалылары:",
  symbols: [
    ["n", "ойын саны"],
    ["X_i", "i-ойындағы нәтиже"],
    ["μ", "теориялық орташа мән"]
  ],
  verdictTitle: "Есеп мәні:",
  verdict: (
    <>
      Ойын саны артқан сайын симуляция кездейсоқ шу емес, нақты орташа мәнді көрсетеді.
    </>
  ),
  statementTitle: "Көп қайталау шындықты ашады",
  statement:
    "Monte Carlo кездейсоқ нәтижелерді мың рет қайталап, ұзақ мерзімдегі ықтимал бағытты көрсетеді.",
  statementTextClassName: "text-lg sm:text-xl",
  watermark: "X̄_n"
};

export const illusionHeroMath = {
  leftFormula: (
    <div className="text-[clamp(2rem,4.8vw,3.7rem)] font-serif italic text-white leading-none tracking-tighter">
      P(W<sub className="text-[0.45em]">k</sub>)
      <span className="mx-3 text-white/40">=</span>
      p<sup className="text-[0.45em]">k</sup>
    </div>
  ),
  leftLabel: "қатар жеңіс ықтималдығы",
  rightFormula: (
    <span className="text-[clamp(1.9rem,4.3vw,3.5rem)]">
      P(L ≥ 1) = 1 - p<sup className="text-[0.45em]">n</sup>
    </span>
  ),
  rightLabel: "сериядағы кемі бір ұтылыс",
  symbolsTitle: "Серия айнымалылары:",
  symbols: [
    ["p", "бір ойындағы ұту ықтималдығы"],
    ["k", "қатар жеңіс саны"],
    ["n", "серия ұзындығы"]
  ],
  verdictTitle: "Иллюзия мәні:",
  verdict: (
    <>
      Қысқа жеңіс сериясы мүмкін, бірақ ұзын серияда <b className="text-cyan-400">P(L ≥ 1)</b> өседі.
    </>
  ),
  statementTitle: "Серия бақылау емес",
  statement:
    "Бірнеше жеңіс заңдылық болып көрінеді, бірақ ықтималдық бойынша ұзақ серия міндетті түрде ұтылысты жақындатады.",
  statementTextClassName: "text-lg sm:text-xl",
  watermark: "p^k"
};

export const particlesHeroMath = {
  leftFormula: (
    <div className="text-[clamp(2rem,4.8vw,3.6rem)] font-serif italic text-white leading-none tracking-tighter">
      z = αv + βf - θ
    </div>
  ),
  leftLabel: "импульс индексі",
  rightFormula: (
    <span className="text-[clamp(1.8rem,4.2vw,3.45rem)]">
      P(I) = 1 / (1 + e<sup className="text-[0.45em]">-z</sup>)
    </span>
  ),
  rightLabel: "импульсивті шешім ықтималдығы",
  symbolsTitle: "Модель айнымалылары:",
  symbols: [
    ["v", "қозғалыс жылдамдығы"],
    ["f", "әрекет жиілігі"],
    ["θ", "қауіп шегі"]
  ],
  verdictTitle: "Есеп мәні:",
  verdict: (
    <>
      Жылдам әрекет көбейгенде <b className="text-cyan-400">z</b> өседі, ал P(I) 1-ге жақындайды.
    </>
  ),
  statementTitle: "Импульс ықтималдықпен өлшенеді",
  statement:
    "Қозғалыс қарқыны шешімнің асығыс қабылдану ықтималдығын көрсетеді.",
  statementTextClassName: "text-lg sm:text-xl",
  watermark: "sigma(z)"
};

export const gestureHeroMath = {
  leftFormula: (
    <div className="text-[clamp(1.9rem,4.4vw,3.4rem)] font-serif italic text-white leading-none tracking-tighter">
      P(defense)
      <span className="mx-3 text-white/40">=</span>
      s / (s + r)
    </div>
  ),
  leftLabel: "қорғаныс ықтималдығы",
  rightFormula: (
    <span className="text-[clamp(1.9rem,4.4vw,3.45rem)]">
      P(risk) = r / (s + r)
    </span>
  ),
  rightLabel: "қауіп ықтималдығы",
  symbolsTitle: "Ойын айнымалылары:",
  symbols: [
    ["s", "тоқтатылған қауіпті объектілер"],
    ["r", "өтіп кеткен қауіпті объектілер"],
    ["s+r", "барлық шешім саны"]
  ],
  verdictTitle: "Есеп мәні:",
  verdict: (
    <>
      Қорғаныс үлесі артса P(risk) төмендейді, ал өткізіп алу тәуекелді өсіреді.
    </>
  ),
  statementTitle: "Қорғаныс та ықтималдық",
  statement:
    "Әр сәтте таңдау бар: тоқтату немесе өткізіп алу. Нәтиже score/risk қатынасымен өлшенеді.",
  statementTextClassName: "text-lg sm:text-xl",
  watermark: "s/(s+r)"
};

export const spiderHeroMath = {
  leftFormula: (
    <div className="text-[clamp(1.9rem,4.3vw,3.4rem)] font-serif italic text-white leading-none tracking-tighter">
      P(C ≥ 1)
      <span className="mx-3 text-white/40">=</span>
      1 - (1 - a)<sup className="text-[0.45em]">c</sup>
    </div>
  ),
  leftLabel: "ой байланысының ықтималдығы",
  rightFormula: (
    <span className="text-[clamp(1.9rem,4.4vw,3.45rem)]">
      F<sub className="text-[0.45em]">t</sub> = 1 - e<sup className="text-[0.45em]">-λc_t</sup>
    </span>
  ),
  rightLabel: "фокус жиналу моделі",
  symbolsTitle: "Назар айнымалылары:",
  symbols: [
    ["a", "бір ойдың байланыс ықтималдығы"],
    ["c", "жақын ой түйіндерінің саны"],
    ["F_t", "жиналған фокус деңгейі"]
  ],
  verdictTitle: "Есеп мәні:",
  verdict: (
    <>
      Байланыс саны көбейген сайын ой бір орталыққа тартылу ықтималдығы артады.
    </>
  ),
  statementTitle: "Ой байланысы жинақталады",
  statement:
    "Көп ұсақ триггер бір үлкен фокусқа айналады: бұл да ықтималдықтың жинақталуы.",
  statementTextClassName: "text-lg sm:text-xl",
  watermark: "1-(1-a)^c"
};

export const finalHeroMath = {
  leftFormula: (
    <div className="text-[clamp(2rem,5vw,3.6rem)] font-serif italic text-white leading-none tracking-tighter">
      Формулалар
    </div>
  ),
  leftLabel: "барлық ықтималдық формулалары",
  rightFormula: <span className="text-[clamp(2.4rem,5vw,4rem)]">10 / 10</span>,
  rightLabel: "қорытынды",
  symbolsTitle: "Негізгі формулалар:",
  symbols: [
    ["P(A|B)", "шартты ықтималдық"],
    ["E[X]", "күтілетін мән"],
    ["P(W_k)", "серия ықтималдығы"],
    ["P(risk)", "қауіп үлесі"]
  ],
  verdictTitle: "Қорытынды:",
  verdict: <>Барлық экрандағы есеп бір идеяға келеді: тәуекел қайталанса, ықтималдық жинақталады.</>,
  statementTitle: "Формулалар тізімі",
  statement: formulaSummary.join(" | "),
  statementTextClassName: "text-base sm:text-lg",
  watermark: "ΣP"
};
