import React, { useState, useEffect } from 'react'

export default function useSidebarStatus(savedPageStatus) {
  const [pageStatus, setPageStatus] = useState(savedPageStatus)

  return [pageStatus, setPageStatus]
}
