export const formatDate = (date) => {
    if (date == null) return "";
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };
  
  export function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }
  
  export const formatCurrency = (amount, upto = 2) => {
    const numberAmount = parseFloat(amount);
  
    if (Number.isInteger(numberAmount)) {
      return `$${numberAmount.toString()}`;
    }
  
    return `$${numberAmount.toFixed(upto)}`;
  };
  
  export const scrollToElement = (elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  
 


 export const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };