"use client"

type Props = {
  title?: string
  embedUrl: string
  height?: number | string
}

export default function WindguruOfficialEmbed({
  title = "Morocco – Dakhla, WG",
  embedUrl,
  height = 350,
}: Props) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Conditions</p>
          <h2 className="text-display text-3xl">{title}</h2>
        </div>
        <span className="text-xs text-muted-foreground">Powered by Windguru</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <iframe
          src={embedUrl}
          width="100%"
          height={typeof height === "number" ? `${height}px` : height}
          frameBorder="0"
          scrolling="yes"
          loading="lazy"
          style={{ minWidth: 900 }}
          title={title}
        />
      </div>
    </div>
  )
}
