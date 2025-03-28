"use client";
import { ChartPoint } from "@/app/types/chart-point";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Clock, MousePointerClick } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChartNSH } from "@/components/ChartNSH";

export default function Home() {
  const [isRunningBenchmark, setIsRunningBenchmark] = useState<boolean>(false);
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);

  const [key1, setKey1] = useState<string>("Z");
  const [key2, setKey2] = useState<string>("X");
  const [mode, setMode] = useState<"clicks" | "seconds">("clicks");
  const [clicks, setClicks] = useState<number>(100);
  const [seconds, setSeconds] = useState<number>(60);
  const inputRef1 = useRef<HTMLInputElement>(null!);
  const inputRef2 = useRef<HTMLInputElement>(null!);

  function getBpm(clicks: number, ms: number): number {
    return Math.floor((clicks / ms) * 15000);
  }

  function toggleIsRunningBenchmark() {
    if (!isRunningBenchmark) {
        setChartPoints([]);
    }
      
    setIsRunningBenchmark(!isRunningBenchmark);
  }

  function startBenchmark() {
    toggleIsRunningBenchmark();
  }

  // Setting keybinds to default if empty and select new Keybind
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    defaultValue: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (e.target.value === "") setValue(defaultValue);
  };
  // Select all when focus
  const handleFocus = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.select();
  };

  useEffect(() => {
    window.onkeydown = (e) => {
      if (e.key === " " && !isRunningBenchmark) {
        toggleIsRunningBenchmark();
        console.log("Benchmarking");
        return;
      }

      if (!isRunningBenchmark) {
        return;
      }

      if ([key1, key2].includes(e.key.toUpperCase())) {
        setChartPoints((chartPoints) => [
          ...chartPoints,
          {
            seconds: "0",
            bpm: 0,
            ur: 0,
            key: e.key,
            timestamp: Date.now(),
          },
        ]);

        console.log([
          ...chartPoints,
          {
            seconds: "0",
            bpm: 0,
            ur: 0,
            key: e.key,
            timestamp: Date.now(),
          },
        ]);
      }
    };
  }, [chartPoints, isRunningBenchmark, key1, key2]);

  return (
    <>
      <div className="mb-12 flex flex-col items-center">
        <section className="relative flex w-full max-w-[1300px] flex-row md:justify-center">
          <h1 className="mt-2 pt-1.5 pl-3 text-2xl font-medium md:text-4xl">
            osu! Tapping Benchmark
          </h1>
          <Button
            variant={"ghost"}
            className="absolute top-3 right-3 cursor-pointer"
            onClick={() =>
              window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            }
          >
            My Stats
          </Button>
        </section>

        <section className="section mt-24">
          <div className="flex flex-col">
            <Label className="gap-1">
              Stop at{" "}
              {mode === "clicks" ? (
                <span>{clicks} clicks</span>
              ) : (
                <span>{seconds} seconds</span>
              )}
            </Label>
            <div className="flex">
              {mode === "clicks" ? (
                <Input
                  type="number"
                  min={3}
                  className="input rounded-r-none"
                  value={clicks}
                  onChange={(e) => setClicks(Number(e.target.value))}
                />
              ) : (
                <Input
                  type="number"
                  min={1}
                  className="input rounded-r-none"
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                />
              )}

              <ToggleGroup type="single" variant="nsh">
                <ToggleGroupItem
                  value="clicks"
                  className={`first:rounded-l-none ${mode === "clicks" ? "bg-zinc-700 hover:bg-zinc-700" : ""}`}
                  onClick={() => setMode("clicks")}
                >
                  <MousePointerClick />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="seconds"
                  onClick={() => setMode("seconds")}
                  className={
                    mode === "seconds" ? "bg-zinc-700 hover:bg-zinc-700" : ""
                  }
                >
                  <Clock />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </section>

        <section className="section mt-2">
          <div>
            <p>Choose your keybinds:</p>
            <div className="flex flex-row justify-center gap-1">
              <input
                type="text"
                maxLength={2}
                className="input size-9 rounded-md border text-center align-top leading-none caret-transparent"
                value={key1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setKey1((e.target.value.at(-1) || "").toUpperCase())
                }
                onBlur={(e) => handleBlur(e, "Z", setKey1)}
                onFocus={() => handleFocus(inputRef1)}
                ref={inputRef1}
              />
              <input
                type="text"
                maxLength={2}
                className="input size-9 rounded-md border text-center align-top leading-none caret-transparent"
                value={key2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setKey2((e.target.value.at(-1) || "").toUpperCase())
                }
                onBlur={(e) => handleBlur(e, "X", setKey2)}
                onFocus={() => handleFocus(inputRef2)}
                ref={inputRef2}
              />
            </div>
          </div>
        </section>

        <section className="section mt-12 text-6xl font-bold">
          <div className="flex flex-col items-center">
            <p>274 BPM</p>
            <Button
              className="text-foreground mt-4 cursor-pointer bg-sky-600 hover:bg-sky-600/75"
              onClick={() => startBenchmark()}
            >
              {isRunningBenchmark ? "Stop Benchmark" : "Start Benchmark"}
            </Button>
          </div>
        </section>
        <section className="section mt-20">
          <div className="flex flex-col items-center">
            <p>0 clicks / 0.00s</p>
            <p>0 UR</p>
            <ChartNSH data={chartPoints} />
            {/* <canvas
              id="benchmark"
              className="mt-4 w-120 rounded-md bg-zinc-900 px-3 py-1"
            ></canvas> */}
          </div>
        </section>
      </div>
    </>
  );
}
