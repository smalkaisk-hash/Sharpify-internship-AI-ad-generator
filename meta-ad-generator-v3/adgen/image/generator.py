"""Generate brand background images using Pollinations AI."""
from __future__ import annotations

import random
import re
import time
from pathlib import Path

import pollinations

from adgen import paths
from adgen.image.prompt_builder import build_prompt

_RETRY_DELAYS = [10, 20, 40]


_FORMAT_DIMENSIONS: dict[str, tuple[int, int]] = {
    "square": (1080, 1080),
    "portrait": (1080, 1350),
}


def _generate_one(
    domain: str,
    out_path: Path,
    seed: int,
    model: str,
    concept: str = "lifestyle",
    width: int = 1080,
    height: int = 1080,
) -> Path:
    """Generate a single image. build_prompt() is called fresh so each image gets a new random prompt."""
    prompt, negative = build_prompt(domain, concept=concept)

    print(f"[image] Seed:    {seed}")
    print(f"[image] Concept: {concept}")
    print(f"[image] Size:    {width}x{height}")
    print(f"[image] Prompt:  {prompt}")

    gen = pollinations.Image(
        model=model,
        width=width,
        height=height,
        seed=seed,
        nologo=True,
        private=False,
        enhance=True,
        safe=True,
    )

    last_err: Exception | None = None
    for attempt, delay in enumerate([0] + _RETRY_DELAYS):
        if delay:
            print(f"[image] Rate-limited, retrying in {delay}s… (attempt {attempt + 1})")
            time.sleep(delay)
        try:
            gen(prompt=prompt, negative=negative, file=str(out_path), save=True)
            break
        except Exception as exc:
            last_err = exc
            if "429" not in str(exc):
                raise
    else:
        raise RuntimeError(f"Pollinations failed after retries: {last_err}") from last_err

    return out_path


def generate_image(
    domain: str,
    count: int = 1,
    seed: int | None = None,
    model: str = "flux",
    concept: str = "lifestyle",
    fmt: str = "square",
    append: bool = False,
) -> list[Path]:
    """Generate `count` brand images, each with a freshly randomised prompt.

    Returns a list of saved file paths.
    Single image → clients/<domain>/image/generated.jpg
    Multiple     → clients/<domain>/image/generated-1.jpg, generated-2.jpg, …

    concept: "lifestyle" | "product-flat" | "before-after" | "social-proof"
    fmt: "square" (1080×1080) | "portrait" (1080×1350)
    append: when True, start numbering after the highest existing generated-N file
            so existing images are never overwritten.
    """
    width, height = _FORMAT_DIMENSIONS.get(fmt, (1080, 1080))
    image_dir = paths.image_dir(domain)
    image_dir.mkdir(parents=True, exist_ok=True)

    suffix = f"-{concept}" if concept != "lifestyle" else ""
    suffix += f"-{fmt}" if fmt != "square" else ""

    # When appending, find the highest existing index so we never overwrite.
    start_index = 1
    if append:
        _pat = re.compile(rf"generated{re.escape(suffix)}-(\d+)\.jpg$")
        existing_nums = [
            int(m.group(1))
            for f in image_dir.iterdir()
            if f.is_file() and (m := _pat.match(f.name))
        ]
        if existing_nums:
            start_index = max(existing_nums) + 1
        print(f"[image] --append: starting at generated{suffix}-{start_index}.jpg")

    results: list[Path] = []
    seeds: list[int] = []

    for i in range(count):
        actual_seed = seed if (seed is not None and count == 1) else random.randint(1, 999_999)
        seeds.append(actual_seed)

        if append:
            out_path = image_dir / f"generated{suffix}-{start_index + i}.jpg"
        else:
            out_path = (
                image_dir / f"generated{suffix}.jpg"
                if count == 1
                else image_dir / f"generated{suffix}-{i + 1}.jpg"
            )

        if i > 0:
            time.sleep(5)  # brief pause between requests

        _generate_one(domain, out_path, actual_seed, model, concept=concept, width=width, height=height)
        results.append(out_path)

    (image_dir / "seed.txt").write_text("\n".join(str(s) for s in seeds), encoding="utf-8")
    return results
