
// Aguarda o HTML ser carregado
document.addEventListener("DOMContentLoaded", () => {
    // Elementos da interface
    const toggleContrastBtn = document.getElementById("toggle-contrast");
    const colorPicker = document.getElementById("color-picker");
    const pwmSlider = document.getElementById("pwm-slider");
    const pwmValueLabel = document.getElementById("pwm-value");
    const virtualLed = document.getElementById("virtual-led");
    const btnFadeIn = document.getElementById("btn-fade-in");
    const btnFadeOut = document.getElementById("btn-fade-out");

    // Estado do simulador
    let currentHexColor = colorPicker.value;
    let currentPwmValue = Number(pwmSlider.value);
    let fadeInterval = null;

    // Converte o valor PWM em porcentagem
    function calcularPercentual(valor) {
        return Math.round((valor / 255) * 100);
    }

    // Atualiza o texto de estado do PWM
    function atualizarTextoPWM(mensagem = "") {
        const percentual = calcularPercentual(currentPwmValue);

        pwmValueLabel.textContent = mensagem
            ? `Valor PWM: ${currentPwmValue} (${percentual}% - ${mensagem})`
            : `Valor PWM: ${currentPwmValue} (${percentual}% do brilho máximo)`;
    }

    // Atualiza a representação visual do LED
    function atualizarVisualizacaoLED() {
        const intensidade = currentPwmValue / 255;

        virtualLed.style.backgroundColor = currentHexColor;
        virtualLed.style.opacity = intensidade;

        // O brilho também varia com o PWM
        virtualLed.style.boxShadow =
            `0 0 ${35 * intensidade}px ${currentHexColor}`;

        virtualLed.setAttribute(
            "aria-label",
            currentPwmValue > 0
                ? `LED virtual ligado, cor ${currentHexColor}, intensidade ${calcularPercentual(currentPwmValue)} por cento`
                : "LED virtual desligado"
        );

        atualizarTextoPWM();
    }

    // Encerra uma animação que esteja em andamento
    function pararAnimacao() {
        if (fadeInterval !== null) {
            clearInterval(fadeInterval);
            fadeInterval = null;
        }
    }

    // Inicia a animação de brilho
    function executarFade(tipo) {
        pararAnimacao();

        const aumentando = tipo === "in";
        currentPwmValue = aumentando ? 0 : 255;

        pwmSlider.value = currentPwmValue;
        atualizarVisualizacaoLED();

        atualizarTextoPWM(
            aumentando ? "executando Fade-In" : "executando Fade-Out"
        );

        fadeInterval = setInterval(() => {
            if (aumentando) {
                currentPwmValue = Math.min(currentPwmValue + 5, 255);
            } else {
                currentPwmValue = Math.max(currentPwmValue - 5, 0);
            }

            pwmSlider.value = currentPwmValue;
            atualizarVisualizacaoLED();

            if (
                (aumentando && currentPwmValue >= 255) ||
                (!aumentando && currentPwmValue <= 0)
            ) {
                pararAnimacao();

                atualizarTextoPWM(
                    aumentando
                        ? "Fade-In concluído"
                        : "Fade-Out concluído"
                );
            }
        }, 25);
    }

    // 1. Alternância do alto contraste
    toggleContrastBtn.addEventListener("click", () => {
        const ativo = document.body.classList.toggle("high-contrast");

        toggleContrastBtn.setAttribute("aria-pressed", String(ativo));

        toggleContrastBtn.textContent = ativo
            ? "☀️ Desativar Alto Contraste"
            : "🌓 Alto Contraste";
    });

    // 2. Seletor de cor
    colorPicker.addEventListener("input", (event) => {
        currentHexColor = event.target.value;
        atualizarVisualizacaoLED();
    });

    // 3. Controle manual de brilho
    pwmSlider.addEventListener("input", (event) => {
        pararAnimacao();

        currentPwmValue = Number(event.target.value);
        atualizarVisualizacaoLED();
    });

    // 4. Animações
    btnFadeIn.addEventListener("click", () => {
        executarFade("in");
    });

    btnFadeOut.addEventListener("click", () => {
        executarFade("out");
    });

    // Estado inicial
    atualizarVisualizacaoLED();
});


