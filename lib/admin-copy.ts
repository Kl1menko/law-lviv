export function formatContentStatus(status: string) {
  switch (status) {
    case "draft":
      return "Чернетка";
    case "published":
      return "Опубліковано";
    default:
      return status;
  }
}

export function formatLeadStatus(status: string) {
  switch (status) {
    case "new":
      return "Нове";
    case "in_progress":
      return "У роботі";
    case "closed":
      return "Закрите";
    default:
      return status;
  }
}

export function formatConsultationStatus(status: string) {
  switch (status) {
    case "scheduled":
      return "Заплановано";
    case "completed":
      return "Проведено";
    case "canceled":
      return "Скасовано";
    case "no_show":
      return "Не з'явився";
    default:
      return status;
  }
}

export function formatTemplateType(type: string) {
  switch (type) {
    case "intake_questionnaire":
      return "Первинне опитування";
    case "message_template":
      return "Шаблон повідомлення";
    case "handoff_rule":
      return "Правила передачі";
    case "case_brief":
      return "Шаблон брифу";
    default:
      return type;
  }
}

export function formatAdminSavedKey(saved: string) {
  switch (saved) {
    case "contact":
      return "Контакти збережено.";
    case "seo":
      return "SEO-дані збережено.";
    case "links":
      return "Посилання збережено.";
    case "main":
      return "Основні дані збережено.";
    case "content":
      return "Контент збережено.";
    case "relations":
      return "Зв'язки збережено.";
    case "status":
      return "Статус оновлено.";
    case "consultation":
      return "Консультацію збережено.";
    case "template":
      return "Шаблон збережено.";
    case "item":
      return "Запис збережено.";
    case "create":
      return "Запис створено.";
    default:
      return "Зміни збережено.";
  }
}

export function formatAdminErrorKey(error: string) {
  switch (error) {
    case "contact":
      return "Не вдалося зберегти контакти.";
    case "seo":
      return "Не вдалося зберегти SEO-дані.";
    case "links":
      return "Не вдалося зберегти посилання.";
    case "main":
      return "Не вдалося зберегти основні дані.";
    case "content":
      return "Не вдалося зберегти контент.";
    case "relations":
    case "json":
      return "Не вдалося зберегти зв'язки або JSON-дані.";
    case "status":
      return "Не вдалося оновити статус.";
    case "consultation":
      return "Не вдалося зберегти консультацію.";
    case "template":
      return "Не вдалося зберегти шаблон.";
    case "save":
      return "Не вдалося зберегти запис.";
    case "create":
      return "Не вдалося створити запис.";
    default:
      return "Сталася помилка під час збереження.";
  }
}
