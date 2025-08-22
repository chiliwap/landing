import NewsletterForm from "./newsletter-form";
import { subscribe } from "./actions/newsletter";

export default function Newsletter(props: { className?: string }) {
  return <NewsletterForm action={subscribe} className={props.className} />;
}
