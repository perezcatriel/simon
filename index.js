let secuenciaMaquina = [];
let secuenciaUsuario = [];
let ronda = 0;

document.querySelector("#empezar").onclick = comenzarJuego;

actualizarEstado('Tocá "Empezar" para jugar!');
actualizarNumeroRonda("-");
bloquearInputUsuario();

function comenzarJuego() {
	reiniciarEstado();
	manejarRonda();
}

function reiniciarEstado() {
	secuenciaMaquina = [];
	secuenciaUsuario = [];
	ronda = 0;
}

function manejarRonda() {
	actualizarEstado("Turno de la MAQUINA", "maquina");
	bloquearInputUsuario();

	const $nuevoCuadro = obtenerCuadroAleatorio();
	secuenciaMaquina.push($nuevoCuadro);

	const RETRASO_TURNO_JUGADOR = (secuenciaMaquina.length + 1) * 1000;

	secuenciaMaquina.forEach(function ($cuadro, index) {
		const RETRASO_MS = (index + 1) * 1000;
		setTimeout(function () {
			resaltar($cuadro);
		}, RETRASO_MS);
	});

	setTimeout(function () {
		const $estado = document.querySelector("#info");

		$estado.classList.remove("alert-primary");
		$estado.classList.add("alert-warning");

		actualizarEstado("Turno del JUGADOR", "usuario");
		desbloquearInputUsuario();
	}, RETRASO_TURNO_JUGADOR);

	secuenciaUsuario = [];
	ronda++;
	actualizarNumeroRonda(ronda);
}

function manejarInputUsuario(e) {
	const $cuadro = e.target;

	resaltar($cuadro);
	secuenciaUsuario.push($cuadro);

	const $cuadroMaquina = secuenciaMaquina[secuenciaUsuario.length - 1];

	if ($cuadro.id !== $cuadroMaquina.id) {
		perder();
		return;
	}

	if (secuenciaUsuario.length === secuenciaMaquina.length) {
		bloquearInputUsuario();
		setTimeout(manejarRonda, 1000);
	}
}

function obtenerCuadroAleatorio() {
	const $cuadros = document.querySelectorAll(".cuadro");
	const indice = Math.floor(Math.random() * $cuadros.length);
	return $cuadros[indice];
}

function actualizarNumeroRonda(ronda) {
	document.querySelector("#ronda").textContent = ronda;
}

function actualizarEstado(estado, error) {
	const $estado = document.querySelector("#info");
	$estado.textContent = estado;

	if (error === "maquina") {
		$estado.classList.remove("alert-primary");
		$estado.classList.remove("alert-danger");

		$estado.classList.add("alert-warning");
	} else if (error === "usuario") {
		$estado.classList.remove("alert-warning");

		$estado.classList.add("alert-info");
	} else if (error === "perder") {
		$estado.classList.remove("alert-warning");
		$estado.classList.add("alert-danger");
	}
}

function resaltar($cuadro) {
	$cuadro.style.opacity = 1;
	$cuadro.style.boxShadow = "none";

	setTimeout(function () {
		$cuadro.style.opacity = 0.7;
		$cuadro.style.boxShadow = "0 0 10px 5px black";
	}, 500);
}

function bloquearInputUsuario() {
	document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
		$cuadro.onclick = function () {};
	});
}

function desbloquearInputUsuario() {
	document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
		$cuadro.onclick = manejarInputUsuario;
	});
}

function perder() {
	bloquearInputUsuario();
	actualizarEstado('Perdiste! Tocá "Empezar" para jugar de nuevo!', "perder");
}
