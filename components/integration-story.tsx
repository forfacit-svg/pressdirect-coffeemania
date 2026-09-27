import { details } from "@/content/details";
export function IntegrationStory({ slug }: { slug: string }) {
  const copy = details[slug];
  if (!copy) return null;
  return (
    <section className="integration-story section-wrap">
      <div className="story-intro">
        <span className="eyebrow">О формате</span>
        <div>
          <h2>{copy.title}</h2>
          {copy.paragraphs.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </div>
      </div>
      {copy.items && (
        <div className="story-support">
          {slug === "collaborations" && <h3>Поддержка проекта 360°</h3>}
          <div className="support-grid">
            {copy.items.map(([title, description], i) => (
              <article key={title}>
                <span className="row-number">{String(i + 1).padStart(2, "0")}</span>
                <h4>{title}</h4>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
