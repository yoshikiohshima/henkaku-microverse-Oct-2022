# HENKAKUでの Croquet Microverse コーディング実験用レポジトリ

![Microverse Screenshot](https://croquet.io/images/microversess.png)

## 概要
HENKAKUのコミュニティーの皆さんと Croquet Microverse 用の「behavior」を開発する実験をするためにリポジトリを作りました。

試したい方は、このリポジトリをローカルコンピューターにクローンしてください。

   npm install

と

   npm start

を実行した後で`localhost:9684`にChromeなどのブラウザでアクセスすると、カードが3枚ある大学のキャンパスのようなワールドに入れます。

behaviors/defaultの中には、`lights.js`以外に4つファイルがあります。それら4つはそれぞれちょっとしたbehaviorの例題となっています。`throb.js`が多分一番簡単です。`flip.js`もコンセプトは簡単なのですが、何度も何度も回転させている時に誤差が蓄積しないようにしたりするコードが入っているので、ちょっと複雑化しています。`earth.js`はいわゆるPawn側のみのbehavior moduleで、カードの見た目をプログラムで作り出すことができるという例です。

より詳しい情報は https://github.com/croquet/microverse/tree/main/docs をみていただくことになりますが、Microverseの鍵は「ライブ・プログラミング・システム」です。上記の`localhost:9684`にアクセスした後で、三本線メニューの中にある"Connect"を押してください。その後で、たとえばbehaviors/default/throb.jsを編集してファイル保存すると、その瞬間にそのbehaviorを持っているオブジェクトの振る舞いが変わるので、すぐにどうなっているのかをみてみることができます。
