// nuts.config.js

module.exports = {
    target: 'electron-main', // パッケージングの対象を指定します（mainプロセスの場合は 'electron-main'）
    input: 'main_process/main.ts', // パッケージングのエントリーポイントを指定します
    output: 'dist', // 出力先ディレクトリを指定します
    identifier: 'com.drive-me-test', // アプリケーションの識別子を指定します
    productName: 'drive-me', // アプリケーションの表示名を指定します
    // icon: 'path/to/icon.png', 
    // アプリケーションのアイコンを指定します
    mac: {
        category: 'public.app-category.utilities', // macOSアプリケーションのカテゴリを指定します
    },
    win: {
        target: 'portable', // Windowsアプリケーションのビルドターゲットを指定します
        category: 'Business', // Windowsアプリケーションのカテゴリを指定します
    }
};
