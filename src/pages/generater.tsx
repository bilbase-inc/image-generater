/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import {
  ChangeEvent,
  createRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "~/styles/Home.module.css";

const domain = process.env.NODE_ENV === "production" ? "/image-generater" : "";
const defaultImage = `${domain}/background-images/yoku-black.png`
const imagePaths = [
  // `${domain}/background-images/gradient-blue.png`,
  // `${domain}/background-images/gradient-green.png`,
  // `${domain}/background-images/gradient-orange.png`,
  // `${domain}/background-images/gradient-purple.png`,
  // `${domain}/background-images/gradient-red.png`,
  // `${domain}/background-images/gradient-yellow.png`,
  // `${domain}/background-images/flurry-blue.png`,
  // `${domain}/background-images/flurry-green.png`,
  // `${domain}/background-images/flurry-red.png`,
  // `${domain}/background-images/grid-blue.png`,
  // `${domain}/background-images/grid-gray.png`,
  // `${domain}/background-images/grid-green.png`,
  // `${domain}/background-images/polyhedron-blue.png`,
  // `${domain}/background-images/polyhedron-cold.png`,
  // `${domain}/background-images/polyhedron-green.png`,
  // `${domain}/background-images/polyhedron-orange.png`,
  // `${domain}/background-images/polyhedron-rainbow.png`,
  defaultImage,
];
const placeholderText = "超PayPay祭りを支える\n購入導線の負荷対策について"
const canvasWidth = 1280;
const canvasHeight = 720;

export default function Generater() {
  const [selectedPath, setSelectedPath] = useState<string>(defaultImage);
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>(placeholderText);
  const [textColor, setTextColor] = useState<string>("rgba(255, 255, 255)");
  const [png, setPng] = useState<string | null>(null);
  const imageInputRef = createRef<HTMLInputElement>();

  const create2dCanvas = (): [
    HTMLCanvasElement,
    CanvasRenderingContext2D | null
  ] => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    return [canvas, canvas.getContext("2d")];
  };

  const configureCanvasContext = (
    ctx: CanvasRenderingContext2D
  ): CanvasRenderingContext2D => {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    return ctx;
  };

  const drawText = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // テキスト各行を要素として配列に変換
      const lines = inputText.split("\n");

      let fontSize = 100;
      const lineHeight = 1.25;
      ctx.fillStyle = textColor;
      const font = (_fontSize: number) =>
        `bold ${_fontSize}px Robot, "BIZ UDPGothic", sans-serif`;
      ctx.font = font(fontSize);

      // いずれかの行でテキストが一定幅以上の場合はフォントサイズを縮小させる
      fontSize =
        Math.max(...lines.map((line) => ctx.measureText(line).width)) <=
        canvasWidth * 0.8
          ? 100
          : 80;
      ctx.font = font(fontSize);

      for (const [index, line] of lines.entries()) {
        // 特定の行の開始位置(Y軸)
        let enterPositionY = fontSize;
        if (index) enterPositionY += fontSize * lineHeight * index;

        ctx.fillText(
          line,
          (canvasWidth - ctx.measureText(line).width) / 2,
          canvasHeight / 2 -
            (fontSize * lineHeight * lines.length) / 2 +
            enterPositionY
        );
      }
    },
    [inputText, textColor]
  );

  const drawImage = useCallback(
    (onloadCallback: (image: HTMLImageElement) => void) => {
      const image = new Image();
      if (selectedPath) {
        image.src = selectedPath;
      } else if (inputImage) {
        const reader = new FileReader();
        reader.onload = function () {
          // Canvas上に表示する
          const imageSrc = reader.result;
          if (imageSrc) image.src = imageSrc as string;
        };
        reader.readAsDataURL(inputImage);
      }
      image.onload = () => {
        onloadCallback(image);
      };
    },
    [inputImage, selectedPath]
  );

  useEffect(() => {
    const [canvas, ctx] = create2dCanvas();
    if (ctx) {
      configureCanvasContext(ctx);
      if (selectedPath || inputImage) {
        drawImage((image) => {
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
          drawText(ctx);
          setPng(canvas.toDataURL());
        });
      }
      drawText(ctx);
      setPng(canvas.toDataURL());
    }
  }, [drawImage, drawText, inputImage, selectedPath]);

  const handleDownload = () => {
    if (png) {
      let element = document.createElement("a");
      element.href = encodeURI(png);
      element.download = `generated-${new Date().getTime()}.png`;
      element.target = "_blank";
      element.click();
    }
  };

  return (
    <>
      <Head>
        <title>Image Generater</title>
        <meta name="description" content="ImageGenerater produced by YOKU" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ margin: "24px" }}>
        <p>{`アスペクト比 16:9 ( ${canvasWidth}px × ${canvasHeight}px ) で生成されます`}</p>
        <div className={styles.section}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <p>背景画像を選択してください</p>
            {/* <button
              style={{ padding: "8px" }}
              onClick={() => imageInputRef.current?.click()}
            >
              画像をアップロードして使用
            </button> */}
            {inputImage && <p>{inputImage.name}</p>}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (!!event.target.files?.length) {
                  setSelectedPath("");
                  setInputImage(event.target.files[0]);
                }
              }}
            />
          </div>
          <div
            className={styles.grid}
            style={{ backgroundColor: "white", padding: "20px" }}
          >
            {imagePaths.map((path) => (
              <div
                key={path}
                className={path === selectedPath ? styles.selected : undefined}
              >
                <img
                  src={path}
                  alt={path}
                  style={{
                    width: "256px",
                    height: "144px",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    imageInputRef.current!.value = "";
                    setInputImage(null);
                    setSelectedPath(path);
                  }}
                />
                {path === selectedPath && (
                  <span className={styles["selected-text"]}>選択中</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <p>挿入テキスト</p>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
            }}
          >
            <textarea
              style={{ width: "250px", height: "100px", padding: "4px 8px" }}
              placeholder={placeholderText}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setInputText(event.target.value)
              }
            />
            <div
              style={{
                display: "flex",
                gap: "16px",
              }}
            >
              <button
                style={{ padding: "4px 8px" }}
                disabled
                onClick={() => setTextColor("rgba(0, 0, 0, 0.85")}
              >
                黒文字
              </button>
              <button
                style={{ padding: "4px 8px" }}
                onClick={() => setTextColor("rgba(255, 255, 255")}
              >
                白文字
              </button>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <p>プレビュー</p>
          <div style={{ backgroundColor: "white", padding: "20px" }}>
            {png && (
              <div
                className="comp"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  alt="icon"
                  src={png}
                  style={{ width: "768px", height: "432px" }}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={styles.section}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            style={{ padding: "16px 24px", fontSize: "20px" }}
            onClick={handleDownload}
          >
            ダウンロード
          </button>
        </div>
      </main>
    </>
  );
}
