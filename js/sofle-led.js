/* ============================================================
   CODEKEEB — donde estan los LED de verdad
   ------------------------------------------------------------
   Esto es lo que faltaba y por lo que los efectos salian con ruido: el
   Sofle NO lleva un LED por tecla. Lleva **30 LED de underglow por
   mitad**, en una cadena que recorre el contorno de la placa, y varias
   teclas comparten el mismo LED.

   PIX_L / PIX_R son las coordenadas de esos 30 LED en el espacio en que
   el firmware calcula los efectos (no son pixeles de pantalla).
   KP_L / KP_R dicen, para cada una de las 60 posiciones del keymap, que
   LED de la cadena le toca.

   Calcular un color por tecla a partir de su x,y da 60 valores
   independientes y el degradado se deshace en confeti. Con esta tabla
   salen bandas, que es lo que se ve en el teclado y en el editor.

   Copiado tal cual de `keymap-studio/index.html`; no se edita a mano.
   ============================================================ */

const CK_LED = {
  PIX_L: [[100,6],[100,26],[100,46],[100,66],[112,74],[117,84],[103,84],[82,84],[80,63],[80,43],[80,23],[80,3],[60,0],[60,20],[60,40],[60,60],[61,84],[40,84],[40,63],[40,43],[40,23],[40,3],[20,9],[20,29],[20,49],[20,69],[0,69],[0,49],[0,29],[0,9]],
  PIX_R: [[140,6],[140,26],[140,46],[140,66],[128,74],[123,84],[137,84],[158,84],[160,63],[160,43],[160,23],[160,3],[180,0],[180,20],[180,40],[180,60],[179,84],[200,84],[200,63],[200,43],[200,23],[200,3],[220,9],[220,29],[220,49],[220,69],[240,69],[240,49],[240,29],[240,9]],
  KP_L: [29,22,21,12,11,0,0,0,0,0,0,0,28,23,20,13,10,1,1,1,1,1,1,1,27,24,19,14,9,2,2,2,2,2,2,2,26,25,18,15,8,3,4,3,3,3,3,3,3,3,17,16,7,6,5,5,5,5,5,5],
  KP_R: [0,0,0,0,0,0,0,11,12,21,22,29,1,1,1,1,1,1,1,10,13,20,23,28,2,2,2,2,2,2,2,9,14,19,24,27,3,3,3,3,3,3,3,4,3,8,15,18,25,26,5,5,5,5,5,5,6,7,16,17],
};
