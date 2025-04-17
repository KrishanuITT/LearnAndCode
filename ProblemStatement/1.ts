// let input:string = "abc$d"
// let charachters:string[] = []
// let count = 0
// let output:string="";

// for(let i=0;i<input.length;i++){
//     if(input[i]>='a'&& input[i]<='z'){
//         charachters[count++] = input[i]
//     }
// }

// for(let i=0;i<input.length;i++){
//     if(input[i]>='a' && input[i]<='z'){
//         output+=charachters[--count];
//     }
//     else{
//         output+=input[i]
//     }
// }
// console.log("Input:",input)
// console.log("Output:",output);

let input:string = "abc$d"
let input_length:number = input.length;
let output:string = "";

console.log("Input",input)

for(let index=0;index<input_length;index++){
    if(input[index]>='a'&& input[index]<='z'){
        output+=input[input_length-index-1];
        console.log(input[input_length-index-1]);
    }   
    else{
        output+=input[index];
    }
}
console.log("Output",output);