import Head from "next/head";
import { ChangeEvent, createRef, useEffect, useState } from "react";
import styles from "~/styles/Home.module.css";

const domain = process.env.NODE_ENV === "production" ? "/image_generater" : "";
const imagePaths = [
  `${domain}/background-images/gradient-blue.png`,
  `${domain}/background-images/gradient-green.png`,
  `${domain}/background-images/gradient-orange.png`,
  `${domain}/background-images/gradient-purple.png`,
  `${domain}/background-images/gradient-red.png`,
  `${domain}/background-images/gradient-yellow.png`,
  `${domain}/background-images/flurry-blue.png`,
  `${domain}/background-images/flurry-green.png`,
  `${domain}/background-images/flurry-red.png`,
  `${domain}/background-images/grid-blue.png`,
  `${domain}/background-images/grid-gray.png`,
  `${domain}/background-images/grid-green.png`,
  `${domain}/background-images/polyhedron-blue.png`,
  `${domain}/background-images/polyhedron-cold.png`,
  `${domain}/background-images/polyhedron-green.png`,
  `${domain}/background-images/polyhedron-orange.png`,
  `${domain}/background-images/polyhedron-rainbow.png`,
];
const canvasWidth = 1280;
const canvasHeight = 720;

export default function Generater() {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>(
    "超PayPay祭りを支える\n購入導線の負荷対策について"
  );
  const [textColor, setTextColor] = useState<string>("rgba(255, 255, 255)");
  const [png, setPng] = useState<string | null>(null);
  const imageInputRef = createRef<HTMLInputElement>();

  const drawText = (ctx: CanvasRenderingContext2D) => {
    const lines = inputText.split("\n");
    var fontSize = 100;
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Robot, "BIZ UDPGothic", sans-serif`;
    fontSize =
      Math.max(...lines.map((line) => ctx.measureText(line).width)) <=
      canvasWidth * 0.8
        ? 100
        : 80;
    ctx.font = `bold ${fontSize}px Robot, "BIZ UDPGothic", sans-serif`;
    const lineHeight = 1.25;
    for (var i = 0; lines.length > i; i++) {
      var addY = fontSize;
      if (i) addY += fontSize * lineHeight * i;
      ctx.fillText(
        lines[i],
        (canvasWidth - ctx.measureText(lines[i]).width) / 2,
        canvasHeight / 2 - (fontSize * lineHeight * lines.length) / 2 + addY
      );
    }
  };

  useEffect(() => {
    const canvasElem = document.createElement("canvas");
    canvasElem.width = canvasWidth;
    canvasElem.height = canvasHeight;
    const ctx = canvasElem.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (selectedPath || inputImage) {
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
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
          drawText(ctx);
          setPng(canvasElem.toDataURL());
        };
      }
      drawText(ctx);
      setPng(canvasElem.toDataURL());
    }
  }, [selectedPath, inputImage, inputText, textColor]);

  const handleDownload = () => {
    if (png) {
      let element = document.createElement("a");
      element.href = encodeURI(png);
      element.download = "generated.png";
      element.target = "_blank";
      element.click();
    }
  };

  return (
    <>
      <Head>
        <title>Image Generater</title>
        <meta name="description" content="ImageGenerater by kawano-020" />
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
            <button
              style={{ padding: "8px" }}
              onClick={() => imageInputRef.current?.click()}
            >
              画像をアップロードして使用
            </button>
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
