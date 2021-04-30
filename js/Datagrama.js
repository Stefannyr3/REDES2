  /**
  * Método que convierte un número decimal a Binario.
  * @param entero es el numero decimal que se va a tranformar a binario
  * @return el numero resultante de la transformación
  */
 function convertirABinario(numero)
 {   
     let entero = parseInt(numero,10); //Si el número es ingresado en forma de texto (String)
                                       //se hace el parsseInt para convertirel tipo de dato a entero
     
    return entero.toString(2);        //Se retorna el número en binario
 }
 
 
 /**
  * Método que convierte un número binario a hexadecimal.
  * @param entero es el numero Binario que se va a tranformar a hexadecimal
  * @return el numero resultante de la transformación
  */
 function convertirHexadecimal (binario)
 {
     return Number(parseInt(binario,2)).toString(16);   
 }
 
 /**
  * Método que convierte un número hexadecimal a binario.
  * @param entero es el numero hexadecimal que se va a tranformar a binario
  * @return el numero resultante de la transformación
  */
  function convertirHexaABinario (hexadecimal)
  {
     return Number(parseInt(hexadecimal,16)).toString(2);
  }
 
 /**
      * Metodo que dada una ip decimal, este la tranforma a su versión binaria
      *
      * @return la dirección ip transformada en su version binaria
      */
 
  function tranformarIpBinario(ipDecimal)
  {
      let octetos = dividirIp(ipDecimal); //Divide la IP en 4 octetos (Esta variable se vuelve un arreglo)
      let ipBinaria = [];  //Crea un arreglo que tenga el tamaño de octetos.length
     
      /*
      **Se crea un ciclo que se itera 4 veces para recorrer todos los octetos de la IP
      */
      for (let i = 0; i < octetos.length; i++) 
      {
          let ipConvertida = convertirABinario(octetos[i]); //Variable auxiliar, se almacena el resultado 
                                                         //de convertir un octeto de la ip decimal a binario
         
          ipAuxiliar=completarBinarios(ipConvertida,8);
          ipBinaria[i] = ipAuxiliar; //Agrega el octeto resultante al arreglo de la IP binaria
      }
      /**
       * Como cada octeto de la ip quedó almacenada en un arreglo, se recorrerá dicho arreglo
       * para juntarlo y que quede una única cadena de texto con toda la ip en binario
       */
      let ipResultante = "";
      for(let i=0;i< ipBinaria.length;i++)
      {
        ipResultante= ipResultante + ipBinaria[i] +"";
      }
      return ipResultante;

  }
  /**
   * Método que completa la cantidad de bits necesarios para representar un número binario 
   * @param numero representa el número en binario 
   * @param cantidadDigitos cantidad de bits con los que se va a representar el número binario
   * @returns 
   */
  function completarBinarios(numero,cantidadDigitos)
  {
     let auxiliar= numero;
     while (auxiliar.length < cantidadDigitos) 
     {
         auxiliar = "0" + auxiliar; //Agrega 0 a la izquierda para completar la cantidad de bits 
     }
     return auxiliar;
  }
 
  /**
   * Método que divide la dirección IP en 4 octetos
   * @param ip a dividir
   * @returns la ip dividida en un arreglo de 4 posiciones
   */
   function dividirIp (ip)
   {      
     let ipDividida = ip.split("."); 
     return ipDividida;  
   }
 
 
 /**
  * Método para calcular la cantidad de fragmentos que tiene un datagrama
  * @param mtu longitud total se divide entre mtu para obtener la cantidad de fragmentos
  * @param longitudTotal se divide entre el mtu para obtener la cantidad de fragmentos
  * @param flagDF para verificar si se puede dividir el datagrama
  * @returns 
  */
 function calcularCantidadFragmentos(mtu,longitudTotal,flagDF)
 {
     let tam;

     if(flagDF==0) //Verifica si la bandera Dont Fragment es 0
     {
        let cantidadFragmentos= longitudTotal/mtu; //Divide la longitud total entre el MTU
        
        //En caso de ser mayor a 1
        if((cantidadFragmentos%1)==0) 
        {
            tam = cantidadFragmentos; //Si es un número entero, esa será la cantidad de fragmentos
        }
        else
        {
            tam = Math.floor(cantidadFragmentos) + 1; //Si es decimal, se aproxima al siguiente entero
        }
     }
     else
     {
       //En caso de que la bandera Dont Fragment esté activada, el tamaño del datagrama será 1
       tam=1;
     }
     
     return tam;
 }
/**
 * Metodo para calcular la longitud que tendría cada fragmento del datagrama
 * @param {*} mtu 
 * @param {*} longitudTotal 
 * @param {*} flagDF 
 * @returns 
 */
 function calcularLongitud(mtu, longitudTotal,flagDF)
 {
     let cantidadFragmentos = calcularCantidadFragmentos(mtu,longitudTotal,flagDF); //Se calculan la cantidad de fragmentos
     let longitud= mtu; //La longitud máxima de cada fragmento será del tamaño del mtu
     let bytes = longitudTotal-20; //Corresponde al tamaño de un datagrama sin encabezado
     let logFragm = []; //Arreglo donde se almacena el tamaño de cada fragmento
     
     if(flagDF==0) //Verifica si la bandera DF está desactivada
     {
         /**
          * Un ciclo que itera según el número de fragmentos del datagrama  
          */
        for(let i=0 ; i<cantidadFragmentos;i++)
        {
            /**
             * Si la cantidad de bytes que faltan por asignar a los fragmentos es mayor
             * a la cantidad máxima de bytes que puede tener un fragmento
             */
            if(bytes>longitud) 
            {
                logFragm[i]=longitud; //El tamaño del fragmento en la posición correspondiente será del tamaño del MTU
                bytes = bytes - (longitud-20); //Se restan los bytes asignados a la cantidad total de bytes que faltan por asignar
            }
            else
            {
                /**
                 * En caso de que la cantidad de bytes que faltan por asignar sean menor al MTU, 
                 * esos bytes restantes serán asignados a dicho fragmento
                 */
                logFragm[i]=bytes+20; //
            }        
        }
     }
     else
     {
       logFragm[0]=longitudTotal; //Si la flag de Dont Fragment está seteada, la longitud del fragmento 
                                  //será igual al tamaño total del datagrama (Este será descartado)
     }
     
     return logFragm;
 }

 /**
  * Metodo encargado de verificar la bandera MF de cada fragmento del datagrama y calcula su desplazamiento
  * @param  longitudes 
  * @param  mtu 
  * @param  longitudTotal 
  * @param  flagDF 
  * @returns 
  */
 function activarBanderas (longitudes,mtu,longitudTotal,flagDF)
 {   
     let flagMF=[];
     let desplazamientos=[];
     let auxiliar=0;
     /**
      * Se verifica si la bandera DontFragment está desactivada y la longitud del datagrama
      * es mayor al MTU
      */
     if( flagDF==0 && (longitudTotal>mtu))
     {   
         /**
          * En caso de cumplir la condición (La condición valida si el datagrama tiene varios fragmentos)
          * se hará un ciclo que iterará de 0 al tamaño del arreglo
          * longitudes (Este tamaño es igual a la cantidad de fragmentos del datagrama)
          */
        for(let i=0;i<longitudes.length;i++)
        { 
             if(i==0)
             {
                 //Si es el fragmento 0, el desplazamiento será 0 
                 desplazamientos[i]=0;
                 flagMF[i]=1;
             }
             else
             {   
                 /**
                  * 
                  * Si no es el primer fragmento entra acá.
                  * 
                  *El desplazamiento será dado en W64 (Para el desplazamiento no se tienen en cuenta los encabezados)                
                 */              
                 desplazamientos[i]=((longitudes[i-1]-20)/8)+auxiliar;
                 auxiliar= desplazamientos[i];
                 //Verifica que fragmento es
                 if(i==longitudes.length-1)
                 {
                     flagMF[i]=0; //En caso de ser el último fragmento, la bandera MF está desactivada
                 }
                 else
                 {
                     flagMF[i]=1; //Si no es el último fragmento, la bandera estará activa
                 }
             }
        }    
     }
     else
     {
        /**
         * Si la bandera de no fragmentar está activada o la longitud total es menor al mtu
         * Significa que solo hay un fragmento
        */
        flagMF[0]=0; //La bandera MF estará desactivada
        desplazamientos[0]=0; //El desplazamiento será 0
     }
     /**
      * Se retorna un arreglo que contiene la bandera MF en su primer posición y el desplazamiento en la segunda
      */
     return [flagMF,desplazamientos]; 
 }
 /**
  * Método que calcula los datagramas en los 3 formatos
  * @param mtu 
  * @param version 
  * @param longitudEncabezado 
  * @param servicios 
  * @param longitudTotal 
  * @param identificacion 
  * @param flagD 
  * @param TL 
  * @param protocolo 
  * @param ipOrigen 
  * @param ipDestino 
  * @returns 
  */
 function calcularDatagramas (mtu,version,longitudEncabezado,servicios,longitudTotal,identificacion,flagD,TL,protocolo,ipOrigen,ipDestino)
 {
    
     let flagDF=-1; //Valor puesto por defecto para inicializar la variable
     if(document.getElementById("Si").checked) //Verifica que el radio correspondiente a la bandera DF está activado
     {
         //Si el radio "Si" está activado, la bandera DF estará desactivada
         flagDF=0
     }
     else
     {
         //Si el radio "Si" está desactivado, la bandera DF estará activada indicando que el datagrama no se puede fragmentar
         flagDF=1;
         if(longitudTotal>mtu)
         {
             /**
              *En caso de que la longitud del datagrama sea mayor al MTU, aparecerá un mensaje indicando
                que el datagrama se descartará
              */
             
            alert("EL DATAGRAMA SERÁ DESCARTADO");
         }
     }
     let cantidadFragmentos= calcularCantidadFragmentos(mtu,longitudTotal,flagDF); //Se calculan los fragmentos
     let longitudes=calcularLongitud(mtu,longitudTotal,flagDF); //Se calcula la longitud de cada fragmento
     let auxiliar= activarBanderas(longitudes,mtu,longitudTotal,flagDF); //Almacena el arreglo con desplazamiento y bandera MF
    
     let flagsMF= auxiliar[0]; //Se obtienen unicamente las banderas MF
     let desplazamientos = auxiliar[1]; //Se obtienen unicamente los desplazamientos
     let wireShark=[]; //Variable donde se almacenarán los datagramas de cada fragmento en formato wireshark
     let binario=[]; //Variable donde se almacenarán los datagramas de cada fragmento en formato binario
     let hexa=[]; //Variable donde se almacenarán los datagramas de cada fragmento en formato hexadecimal
     //Se hace un for que itera desde 0 hasta la cantidad de fragmentos del datagrama
     for(let i=0;i<cantidadFragmentos;i++)
     {
         let longitudAuxiliar= longitudes[i]; //Se toma la longitud del fragmento en la posicion indicada
         let flagAuxiliar= flagsMF[i]; //Se toma el flag MF de la posicion indicada
         let desplazamientoAuxiliar= desplazamientos[i]; //Se toma el desplazamiento de la posicion indicada
         //Crea los datagramas en los diferentes formatos
         wireShark[i] = crearDatagramaWireshark(version,longitudEncabezado,servicios,longitudAuxiliar,identificacion,flagD,flagDF,flagAuxiliar,desplazamientoAuxiliar,TL,protocolo,ipOrigen,ipDestino);
         binario[i] = crearDatagramaBinario(wireShark[i]);
         hexa[i]= generarDatagramaHexa(binario[i]);
         let datagramaHexa= hexa[i];
         let datagramaWireshark= wireShark[i];
         datagramaWireshark[11]=datagramaHexa[5];// Se setea la suma de comprobación en formato hexa al datagrama Wireshark
         datagramaWireshark[4]=datagramaHexa[2];//Se setea la identificación en formato exa al datagrama wireshark
         wireShark[i]=datagramaWireshark; //Se modifica lo que hay en el datagrama wireShark en la posición indicada
                                          //Reemplazandolo por el datagrama que tiene los valores modificados
         let sumaBinaria = convertirHexaABinario(datagramaHexa[5]); //Se pasa la suma de comprobación de hexa a binario
         sumaBinaria= completarBinarios(sumaBinaria,16); //Se completan los 16 digitos de la suma de comprobacoón
         let palabraAuxiliar ="";
         let datagramaBinario= binario[i]; 
         /**
          * El datagrama binario tiene 40 cuartetos, de los cuales del cuarteto 21 al 24 estan vacios
          * y es el campo de la suma de comprobación, en el for se van a llenar estos campos
          */
         for(let c=20;c<24;c++)
         {
            palabraAuxiliar=sumaBinaria.substring(0,4); //Se toman los primeros 4 digitos de la suma de comprobacion
            sumaBinaria=sumaBinaria.substring(4,sumaBinaria.length); //Se almacenan los digitos restantes
           
            datagramaBinario[c]=palabraAuxiliar; //Se setea en la posicion del arreglo los 4 digitos obtenidos
         }
         binario[i]=datagramaBinario; //Se setea el datagrama binario en la posicion indicada con las modificaciones realizadas
         /**
          * El datagrama hexadecimal que se calcula arriba no está agrupado de manera adecuada
          * Con esta línea  se agrupará de a 2 digitos
          */
         hexa[i]=crearDatagramaHexa(hexa[i]); 
     } 
     return [wireShark,binario,hexa]; //Retorna los datagramas en los 3 formatos
 } 
/**
 * Método para agrupar el datagrama hexadecimal de a 2 digitos
 * @param datagramaHexadecimal
 * @returns 
 */
function crearDatagramaHexa(datagramaHexadecimal)
{
  let datagrama=""
  let datagramaHexa=[];
  let palabraAuxiliar="";
  let a=0;
  //Se recorre un arreglo desde la posición 0 hasta la ultima posición del arreglo que se recibe por parametro
  for(let i = 0; i<datagramaHexadecimal.length;i++)
  {
      //Se juntan todos los elementos del arreglo en una sola cadena de texto
      datagrama= datagrama+datagramaHexadecimal[i]+"";
  }
  //Ciclo que itera mientras la palabra tenga al menos un caracter
  while(datagrama.length>0)
  {
      if(datagrama.length>2)
      {
          //Se ejecuta en caso de que hayan más de dos caracteres en la palabra
          palabraAuxiliar=datagrama.substring(0,2); //Se obtienen los primeros dos caracteres (Digitos hexa)
          datagrama=datagrama.substring(2,datagrama.length);//se guardan en la variable el resto de caracteres
          datagramaHexa[a]=palabraAuxiliar; //Se asigna en la posición indicada los 2 digitos hexa
          a++;
      }
      else
      {
        /**
         * En caso de que la palabra tengo 2 o menos caracteres se aasignarán esos digitos a la palabra auxiliar
         */
          palabraAuxiliar=datagrama;
          datagrama="";
          datagramaHexa[a]=palabraAuxiliar; //Se asignan los digitos a la posición indicada
          a++;
      }
  }
  return datagramaHexa //Se retorna un arreglo, cada posicion contiene 2 digitos hexa
}

 function crearDatagramaWireshark(version,longitudEncabezado,servicios,longitudTotal,identificacion,flagD,flagDF,flagMF,desplazamiento,TL,protocolo,ipOrigen,ipDestino)
 {
     /**
      * Se asigna a cada posición el valor correspondiente que se recibe por parametro
      * El orden va deacuerdo a como se muestra en el datagrama
      * Se omite el valor de la suma de comprobación que es desconocido pero se setea en el método calcularDatagramas()
      */
    let datagrama=[]
    datagrama[0]=version;
    datagrama[1]=longitudEncabezado;
    datagrama[2]=servicios;
    datagrama[3]=longitudTotal;
    datagrama[4]=identificacion;
    datagrama[5]=flagD;
    datagrama[6]=flagDF;
    datagrama[7]=flagMF;
    datagrama[8]=desplazamiento;
    datagrama[9]=TL;
    datagrama[10]=protocolo;
    datagrama[12]=ipOrigen;
    datagrama[13]=ipDestino;
    return datagrama;
 }
 
 /**
  * Método que define que número de protocolo identifica al protocolo recibido
  * @param protocolo 
  * @returns 
  */
 function identificarProtocolo(protocolo)
 {
     let valorProtocolo;
     //El protocolo del parámetro es una cadena, dependiendo del protocolo se define el número que lo identifica
     if(protocolo === "ICMP")
     {
         valorProtocolo = 1;
     } 
 
     if(protocolo === "TCP")
     {
         valorProtocolo = 6;
     } 
 
     if(protocolo === "UDP")
     {
         valorProtocolo = 17;
     } 
     return valorProtocolo;
 }
 
 /**
  * Metodo que crea un datagrama en formato binario
  * @param  datagrama 
  * @returns 
  */
 function crearDatagramaBinario (datagrama)
 {
     let datagramaResultante=[];
    
     /**
      * Se convierten los datos del datagrama obtenido por parametro a binario y se completan según la cantidad
      * de digitos que tiene cada campo
      */
     let version= convertirABinario(datagrama[0]);
     version= completarBinarios(version,4);
 
     let longitudEncabezado=convertirABinario(datagrama[1]);
     longitudEncabezado= completarBinarios(longitudEncabezado,4)
 
     let servicios= convertirABinario(datagrama[2]);
     servicios=completarBinarios(servicios,8);
 
     let longitudTotal = convertirABinario(datagrama[3]);
     longitudTotal = completarBinarios(longitudTotal,16);
 
     let identificacion = convertirABinario(datagrama[4]);
     identificacion = completarBinarios(identificacion,16);
 
     let flagD = convertirABinario(datagrama[5]);
     flagD = completarBinarios(flagD,1);
     
     let flagDF = convertirABinario(datagrama[6]);
     flagDF = completarBinarios(flagDF,1);
     
     let flagMF = convertirABinario(datagrama[7]);
     flagMF = completarBinarios(flagMF,1);
 
     let desplazamiento = convertirABinario(datagrama[8]);
     desplazamiento = completarBinarios(desplazamiento,13);
 
     let tiempoVida = convertirABinario(datagrama[9]);
     tiempoVida = completarBinarios(tiempoVida,8);
 
     let protocolo = identificarProtocolo(datagrama[10])
     protocolo= convertirABinario(protocolo);
     protocolo = completarBinarios(protocolo,8);  
 
     let direccionOrigen = tranformarIpBinario(datagrama[12]);
 
     let direccionDestino = tranformarIpBinario(datagrama[13]);
    //Se setean los campos en cada posición del arreglo
     datagramaResultante[0]=version;
     datagramaResultante[1]=longitudEncabezado;
     datagramaResultante[2]=servicios;
     datagramaResultante[3]=longitudTotal;
     datagramaResultante[4]=identificacion;
     datagramaResultante[5]=flagD;
     datagramaResultante[6]=flagDF;
     datagramaResultante[7]=flagMF;
     datagramaResultante[8]=desplazamiento;
     datagramaResultante[9]=tiempoVida;
     datagramaResultante[10]=protocolo;
     datagramaResultante[12]=direccionOrigen;
     datagramaResultante[13]=direccionDestino;   
     return partirDatagrama(datagramaResultante,11,11,2); //Se divide el datagrama para agrupar de a 4 digitos
 }
 /**
  * Función para dividir el datagrama y agruparlo en 4 digitos
  * @param datagramaResultante 
  * @param valorA 
  * @param valorB 
  * @param  base 
  * @returns 
  */
 function partirDatagrama(datagramaResultante,valorA,valorB,base)
 {
     let data=[];
     let i=0;
     
     let primeraParte="";
     let segundaParte="";
     /**
      * Se divide el datagrama en 2 partes, una que va hasta el campo anterior a la suma de comprobación
      * Y la segunda parte que va desde el campo siguiente a la suma de comprobación al final
        Valor A corresponde al campo del arreglo donde inicia la suma de comprobación
        Valor B corresponde al campo del arreglo donde termina la suma de comprobación
      */
    
    for(i;i<datagramaResultante.length;i++)
     {
         if(i<valorA)
          {
             primeraParte= primeraParte+ datagramaResultante[i]+"";
          }
          if(i>valorB)
          {
             segundaParte= segundaParte+datagramaResultante[i]+"";
          }       
     }
     let a=0;
     let palabraAuxiliar = "";
     //Se agrupa la primer parte de a 4 digitos
     while(primeraParte.length>0)
     {
         if(primeraParte.length>4)
         {
             palabraAuxiliar=primeraParte.substring(0,4);
             primeraParte=primeraParte.substring(4,primeraParte.length);
             data[a]=palabraAuxiliar;
             a++;
         }
         else
         {
             palabraAuxiliar=primeraParte;
             primeraParte="";
             data[a]=palabraAuxiliar;
             a++;
         }
     }
     let b=-1;
     //La variable b indica a partir de que posicion del arreglo se setean los campos de la segunda parte
     if(base==16)
     {
         b=6
     }
     if(base==2)
     {
         b=24
     }
     //Se agrupa la segunda parte del datagrama de a 4 digitos
     palabraAuxiliar= "";
     while(segundaParte.length>0)
     {
         if(segundaParte.length>4)
         {
             palabraAuxiliar=segundaParte.substring(0,4);
             segundaParte=segundaParte.substring(4,segundaParte.length);
             data[b]=palabraAuxiliar;
             b++;
         }
         else
         {
             palabraAuxiliar=segundaParte;
             segundaParte="";
             data[b]=palabraAuxiliar;
             b++;
         }
     }
     return data; //Se retorna el datagrama agrupado de a 4 digitos, los campos del checksum estan vacíos
 }
 
 /**
  * Metodo para generar el datagrama hexadecimal a partir de un datagrama binario
  * @param  datagrama 
  * @returns 
  */
 function generarDatagramaHexa(datagrama)
 {
   let datagramaHexa = [];
    //Ciclo que itera desde 0 hasta el tamaño-1 del datagrama recibido por parámetro
   for(let i=0;i<datagrama.length;i++) 
   { 
       //Los valores del datagrama hexa se asignan en la misma posición del datagrama binario
       datagramaHexa[i]=convertirHexadecimal(datagrama[i]);// Se convierte de binario a hexadecimal
   }
   datagramaHexa= partirDatagrama(datagramaHexa,20,23,16); //Se agrupa el datagrama de a 4 digitos
   datagramaHexa[5]=sumaComprobacion(datagramaHexa); //Con los cuartetos se realiza la suma de comprobación
   return datagramaHexa;
 }

 /**
  * Metodo para realizar la suma de comprobación
  * @param datagrama 
  * @returns 
  */
 function sumaComprobacion(datagrama)
 {
     let auxiliar= parseInt(datagrama[0],16);//Se pasa el primer cuarteto de texto a número
     
     for(let i=1; i<datagrama.length;i++)
     {
         let valorActual = parseInt(datagrama[i],16); //El cuarteto de la posición indicada se convierte a nímero
         if(i<5||i>5) //El campo 5 corresponde a la suma de comprobación
         {
             auxiliar=auxiliar+valorActual; //Se suma el resultado de la suma anterior, con el valor del cuarteto en la posicion actual
             auxiliar= auxiliar.toString(16); //Se convierte a cadena hexadecimal
             //Se verifica que el resultado de la suma tenga 4 digitos (Que no haya desbordamiento)
             if(auxiliar.length>4)
             {  
                 //Si hay desbordamiento:
                 let a= auxiliar.substring(0,1); //Se toma el primer digito
                 a= parseInt(a,16); //Se convierte a hexadecimal numero
                 let b= auxiliar.substring(1,auxiliar.length); //Se toman los otros digitos
                 b= parseInt(b,16); //Se convierte a hexadecimal numero
                 auxiliar = a+b; //Se suman los números
             }
             else
             {
                 auxiliar= parseInt(auxiliar,16);//Se convierte a hexadecimal numero
             }
         }
     }
     let complemento= parseInt("FFFF",16); //Se toma el valor FFFF en número
     let resultado= complemento-auxiliar; //Complemento a1
     return resultado.toString(16);
 }

 /**
  * Método para divir el datagrama en la cantidad de fragmentos específicado
  * Este método se aplica cuando el datagrama está completo
  * @param array 
  * @param tam 
  * @returns 
  */
 function partirFragmentos(array,tam)
 {
     let auxiliar= "";
     let cont=0;
     let posicion=0;
     let arreglo=[];
    for (let i = 0; i < array.length; i++) 
    {
    
        auxiliar= auxiliar + array[i]+"  "; 
        cont++;
        if(cont==tam)
        {
            arreglo[posicion]=auxiliar;
            auxiliar=""
            cont=0;
            posicion++
        }
        
    }
    return arreglo;
 }

/**
 * Función para llenar la tabla del datagrama en formato hexadecimal
 * @param  fragmento 
 * @param  contador 
 */
function llenarTablaHexa(fragmento, contador)
{
    let hexa = fragmento;
    document.getElementById('Tabla_Hexa').innerHTML = "";
    document.getElementById("tituloHexa").innerHTML = "Número Fragmento Hexadecimal: #" + contador;
    let tableBody = document.getElementById("Tabla_Hexa");
   
        for (let i = 0; i < hexa.length; i+=5) 
    {
        let row = tableBody.insertRow(i != 0 ? i / 5 : i);
        
        let cell1 = row.insertCell(0);

        cell1.innerHTML = hexa[i]+ "<br>" + hexa[i + 1] + "<br>" +  hexa[i + 2]+ "<br>" +  hexa[i + 3] + "<br>" +  hexa[i + 4];
    }
}
/**
 * Función para llenar la tabla en formato binario
 * @param  fragmento 
 * @param  contador 
 */
function llenarTablaBinario(fragmento, contador)
{
    let Bin = fragmento;
    document.getElementById('TablaBin').innerHTML = "";
    document.getElementById("tituloBin").innerHTML = "Número Fragmento Binario: #" + contador;
    let tableBody = document.getElementById('TablaBin');

    for (let i = 0; i < Bin.length; i+=5) 
    {
        let row = tableBody.insertRow(i != 0 ? i / 5 : i);
        
        let cell1 = row.insertCell(0);

        cell1.innerHTML = Bin[i]+ "<br>" + Bin[i + 1] + "<br>" +  Bin[i + 2]+ "<br>" +  Bin[i + 3] + "<br>" +  Bin[i + 4];
        
    }
}
/**
 * Función para llenar la tabla en formato wireshark
 * @param wireshark 
 */
function llenarWireshark(wireshark)
{
    let fragmento = wireshark;
    document.getElementById('ipOrigenAcc').innerHTML = fragmento[12];
    document.getElementById('ipDestino2').innerHTML = fragmento[13];
    document.getElementById('totalLength').innerHTML = fragmento[3];
    document.getElementById('numId').innerHTML = fragmento[4];
    document.getElementById('ipOrigen').innerHTML = fragmento[12];
    document.getElementById('ipDestino').innerHTML = fragmento[13];
    
    let flagDF="";
    let flagMF="";
    if(fragmento[6]==1)
    {
        flagDF= "Set"
    }
    else
    {

        flagDF="Not set";
    }
    if(fragmento[7]==1)
    {
        flagMF= "Set"
    }
    else
    {
        flagMF="Not set";
    }
    document.getElementById('binDF').innerHTML = fragmento[6];
    document.getElementById('DF').innerHTML = flagDF;
    document.getElementById('binMF').innerHTML = fragmento[7];
    document.getElementById('MF').innerHTML = flagMF;
    document.getElementById('desplazamiento').innerHTML = fragmento[8] + " (" + (fragmento[8])*8 + " bytes)";
    document.getElementById('ttl').innerHTML = fragmento[9];
    document.getElementById('checksum').innerHTML = fragmento[11];
    let protocolo="";
    if(fragmento[10]==="ICMP")
    {
        protocolo= fragmento[10] + " (01)";
    }
    if(fragmento[10]==="TCP")
    {
        protocolo= fragmento[10] + " (06)";
    }
    if(fragmento[10]==="UDP")
    {
        protocolo= fragmento[10] + " (17)";
    }
    document.getElementById('protocolo').innerHTML=protocolo;
}
/**
 * Función para limpiar los campos de las tablas 
 */
function limpiarCampos()
{
    document.getElementById('ipOrigen').innerHTML = "";
    document.getElementById('ipDestino').innerHTML = "";
    document.getElementById('totalLength').innerHTML = "";
    document.getElementById('numId').innerHTML = "";
    document.getElementById('binDF').innerHTML = "";
    document.getElementById('DF').innerHTML = "";
    document.getElementById('binMF').innerHTML = "";
    document.getElementById('MF').innerHTML = "";
    document.getElementById('desplazamiento').innerHTML = "";
    document.getElementById('ttl').innerHTML = "";
    document.getElementById('checksum').innerHTML = "";
    document.getElementById('TablaBin').innerHTML = "";
    document.getElementById("tituloBin").innerHTML = "Número Fragmento Binario: #"
    document.getElementById('Tabla_Hexa').innerHTML = "";
    document.getElementById("tituloHexa").innerHTML = "Número Fragmento Hexadecimal: #" 
}

/**
 * Función que define las acciones a ejecutar al precionar el botón
 */
 function funcionBoton()
 {
     limpiarCampos(); //Se limpian los campos de las tablas
     document.getElementById('Select_Table').innerHTML=""; //Se obtiene la tabla
     let tableBody = document.getElementById('Select_Table'); 
    
     let ipOrigen= document.getElementById('InputipOrigen').value; //Se obtiene la ip origen introducida
     let ipDestino= document.getElementById('InputipDestino').value; //Se obtiene la ip destino introducida
     let protocolo = "";
    
     /**
      * Se obtiene el protocolo seleccionado
      */
     if(document.getElementById('ICMP').checked)
     {
         protocolo = "ICMP";
     }
     if(document.getElementById('UDP').checked)
     {
         protocolo = "UDP";
     }
     if(document.getElementById('TCP').checked)
     {
         protocolo = "TCP";
     }   
     /**
      * Se define el estado de la bandera DF seleccionada
      */
     let flagDF=-1;
     if(document.getElementById("Si").checked)
     {
         flagDF=0
     }
     else{
         flagDF = 1;
     }
 
     let mtu = document.getElementById('inputMTU').value; //Se obtiene el MTU ingresado
     let longitudTotal = document.getElementById('textLongitud').value; //Se obtiene la longitud total ingresada
     let version = "4";
     let longitudEncabezado = "5";
     let serviciosDiferenciados = "0";
     let identificacion = document.getElementById('inputIdentificacion').value; //Se obtiene el numero de identificacion
     let flagD = 0; //Flag 0
     let TL = document.getElementById('inputTTL').value; //Se obtiene el tiempo de vida
     let tam = calcularCantidadFragmentos(mtu,longitudTotal,flagDF); //Se calcula la cantidad de fragmentos del datagrama
     //Se calculan los datagramas en los 3 formatos
     let datagrama = calcularDatagramas (mtu,version,longitudEncabezado,serviciosDiferenciados,longitudTotal,identificacion,flagD,TL,protocolo,ipOrigen,ipDestino);
     let wireshark= datagrama[0]; //Se obtiene unicamente el datagrama wireshark
     let binario= datagrama[1]; //Se obtiene el datagrama binario
     let hexa= datagrama[2]; //Se obtiene el datagrama hexadecimal

     /**
      * Se recorre la tabla y se le asigna el evento, para que en el momento en el que se le de clic
      * a un fragmento, se muestre su datagrama correspondiente en las tablas
      */
     for (let i = 0; i < tam; i++) 
     {
         let row = tableBody.insertRow(i);
         row.style = "cursor:pointer";
         row.addEventListener("click", function (event) 
        {
            fragmentoHexa = partirFragmentos(hexa[i],4);
            fragmentoBin = partirFragmentos(binario[i],8) 
            fragmentoWireshark= wireshark[i];
   
            llenarTablaHexa(fragmentoHexa,i+1); //Se llena la tabla del datagrama hexadecimal
            llenarTablaBinario(fragmentoBin, i+1) //Se llena la tabla del datagrama binario
            llenarWireshark(fragmentoWireshark) //Se llena la tabla del datagrama wireshark
        });
    
    //Se incertan las celdas de los campos de la tabla de fragmentos
     let cell1 = row.insertCell(0);     
     let cell2 = row.insertCell(1);
     let cell3 = row.insertCell(2);
     let cell4 = row.insertCell(3);
     let cell5 = row.insertCell(4);
     let cell6 = row.insertCell(5);
     let cell7 = row.insertCell(6);
     let cell8 = row.insertCell(7);
    
     //Se incertan los datos especificados del datagrama en la posición indicada en la tabla de fragmentos
     cell1.innerHTML = i+1;
     cell2.innerHTML = "" + identificacion;
     cell3.innerHTML = "" + TL;
     cell4.innerHTML = "" + ipOrigen;
     cell5.innerHTML = "" + ipDestino;
     cell6.innerHTML = "" + protocolo;
     let datagrama= wireshark[i];
     cell7.innerHTML = "" + datagrama[3];
     cell8.innerHTML = "" + datagrama[8];
  
   }
}
/**
 * Metodo para generar numeros aleatorios dentro de un rango de numeros
 * @param  valor 
 * @returns 
 */
function generarAleatorio(valor)
{
    return numIdentificacion = Math.floor(Math.random() * ((valor+1) - 0) + 0);   
}

/**
 * Método que genera valores para un ejercicio de ejemplo
 */
function generarEjercicio()
{
    /**
     * Se generan valores aleatorios para el protocolo, flags e IPs
     */
    let protocolo=generarAleatorio(2);
    if(protocolo==0)
    {
        document.querySelector('#ICMP').checked = true;
    }
    if(protocolo==1)
    {
        document.querySelector('#TCP').checked = true;
    }
    if(protocolo==2)
    {
        document.querySelector('#UDP').checked = true;
    }
    let flagDF= Math.round(Math.random());
    if(flagDF==0)
    {
        document.querySelector('#Si').checked = true;
    }
    if(flagDF==1)
    {
        document.querySelector('#No').checked = true;
    }

    let MTU= "1500";
    let longitudTotal= "8000";
    let ttlAleat = generarAleatorio(255);
    let idAleat = generarAleatorio (65535);
    
    let ipOrigen= generarAleatorio(255) +"."+generarAleatorio(255)+"."+ generarAleatorio(255)+"."+generarAleatorio(255);
    let ipDestino=generarAleatorio(255) +"."+generarAleatorio(255)+"."+ generarAleatorio(255)+"."+generarAleatorio(255);
    
    document.getElementById("inputMTU").value = MTU;
    document.getElementById("textLongitud").value = longitudTotal;
    document.getElementById("InputipOrigen").value = ipOrigen;
    document.getElementById("InputipDestino").value = ipDestino;
    document.getElementById("inputIdentificacion").value = idAleat;
    document.getElementById("inputTTL").value = ttlAleat;
}   