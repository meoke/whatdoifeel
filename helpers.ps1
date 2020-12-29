function testFile($fileName){
    npx tape $fileName | npx tap-summary
}